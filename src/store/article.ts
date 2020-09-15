import { ActionTree, MutationTree, Module, GetterTree } from "vuex";
import {
  ArticleState,
  Article,
  CRUDOperations,
  RootState,
  ValidationError,
  TagObject,
  PagingParameters
} from "./types";
import { normalize, schema } from "normalizr";
import ArticleDataProvider from "@/services/article";
import TagDataProvider from "@/services/tag";
import moment from "moment";

const normalizeArticles = (articles: Article[]) => {
  const articleSchema = new schema.Entity("articles", undefined, {
    idAttribute: "slug"
  });
  const articleList = new schema.Array(articleSchema);
  return normalize(articles, articleList);
};

const state: ArticleState = {
  waiting: null,
  error: null,
  success: null,
  entities: null,
  allIds: null,
  articlesCount: 0,
  tagList: []
};

const mutations: MutationTree<ArticleState> = {
  startRequest(state, operation: keyof CRUDOperations) {
    const { waiting, success, error } = state;
    state.waiting = { ...waiting, [operation]: true };
    state.success = { ...success, [operation]: false };
    state.error = null;
  },
  endRequestSuccess(state, operation: keyof CRUDOperations) {
    const { waiting, success } = state;
    state.waiting = { ...waiting, [operation]: false };
    state.success = { ...success, [operation]: true };
  },
  flushRequestSuccess(state, operation: keyof CRUDOperations) {
    const { success } = state;
    state.success = { ...success, [operation]: false };
  },
  endRequestFail(
    state,
    payload: {
      error: ValidationError<Partial<Article>> | true;
      operation: keyof CRUDOperations;
    }
  ) {
    const { waiting, success } = state;
    const { error, operation } = payload;
    state.waiting = { ...waiting, [operation]: false };
    state.error = { ...state.error, [operation]: error };
  },
  flushError(
    state,
    payload: {
      operation: keyof CRUDOperations;
      field?: keyof Partial<Article>;
    }
  ) {
    if (!state.error) return;

    const { operation, field } = payload;
    if (typeof operation !== "undefined") {
      if (typeof field === "undefined") {
        state.error = { ...state.error, [operation]: null };
      } else {
        const newErrorObject = { ...state.error };
        const currentOperationErrorObject = newErrorObject[operation];
        if (typeof currentOperationErrorObject !== "undefined") {
          if (typeof currentOperationErrorObject !== "boolean") {
            currentOperationErrorObject[field] = false;
            state.error = {
              ...newErrorObject,
              [operation]: {
                ...currentOperationErrorObject
              }
            };
          }
        }
      }
    } else {
      state.error = null;
    }
  },
  setarAticlesCount(state, articlesCount: number) {
    state.articlesCount = articlesCount;
  },
  setArticles(state, payload) {
    const { entities, result } = payload;
    const { articles } = entities;
    state.entities = { ...articles };
    state.allIds = [...result];
  },
  addArticles(state, article: Article) {
    const { entities, allIds } = state;
    const { slug } = article;
    state.entities = { ...entities, [slug]: article };
    if (allIds?.indexOf(slug) === -1) {
      state.allIds = [...allIds, slug];
    }
  },
  setTags(state, tags) {
    state.tagList = [...tags];
  },
  addTag(state, tag) {
    state.tagList = [tag, ...state.tagList];
  },
  pushArticles(state, payload) {
    const { entities, result } = payload;
    const { articles } = entities;
    const { allIds } = state;
    state.entities = { ...state.entities, ...articles };
    if (allIds) {
      const newIds = result.filter((id: string) => allIds?.indexOf(id) === -1);
      state.allIds = [...allIds, ...newIds];
    } else {
      state.allIds = [...result];
    }
  },
  removeArticle(state, slug: string) {
    const { entities, allIds } = state;
    const articles = { ...entities };
    if (allIds) {
      const tempIds = [...allIds];
      delete articles[slug];
      const articleIndex = tempIds.indexOf(slug);
      if (articleIndex !== -1) {
        tempIds.splice(articleIndex, 1);
        state.entities = { ...articles };
        state.allIds = [...tempIds];
        state.articlesCount -= 1;
      }
    }
  }
};

const actions: ActionTree<ArticleState, RootState> = {
  fetchTags({ commit }) {
    return new Promise((resolve, reject) => {
      TagDataProvider.getList()
        .then(({ data }) => {
          commit("setTags", data?.tags);
          resolve(data);
        })
        .catch(() => reject());
    });
  },
  fetchArticle({ commit }, slug: string) {
    commit("startRequest", "read");
    return new Promise((resolve, reject) => {
      ArticleDataProvider.getOne(slug)
        .then(({ data }) => {
          commit("endRequestSuccess", "read");
          commit("addArticles", data?.article);
          resolve(data);
        })
        .catch(() => {
          commit("endRequestFail", { operation: "read", error: true });
          reject();
        });
    });
  },
  fetchArticles(
    { commit },
    payload: { paging: PagingParameters; push: boolean }
  ) {
    commit("startRequest", "read");
    return new Promise((resolve, reject) => {
      const { paging, push } = payload;
      ArticleDataProvider.getList(paging)
        .then(({ data }: { data: any }) => {
          const mutaion = push ? "pushArticles" : "setArticles";
          commit(mutaion, normalizeArticles(data?.articles));
          commit("setarAticlesCount", data.articlesCount);
          commit("endRequestSuccess", "read");
          resolve(data);
        })
        .catch(() => {
          commit("endRequestFail", { operation: "read", error: true });
          reject();
        });
    });
  },
  createArticle({ commit, getters }, newArticle: Partial<Article>) {
    commit("startRequest", "create");
    const { tagList } = newArticle;
    const tags = getters["tags"]
      .filter(
        (tagObject: TagObject) => tagList?.indexOf(tagObject.value) !== -1
      )
      .map((tag: TagObject) => tag.text);
    return new Promise((resolve, reject) => {
      ArticleDataProvider.create({ ...newArticle, tagList: tags })
        .then(({ data }) => {
          commit("endRequestSuccess", "create");
          resolve(data);
        })
        .catch(({ response }) => {
          let error: boolean | string = true;
          const { status } = response;
          if (status === 404) {
            error = "Nothing Found!";
          }
          commit("endRequestFail", { operation: "create", error });
          reject();
        });
    });
  },
  updateArticle({ commit, getters }, newArticle: Partial<Article>) {
    commit("startRequest", "update");
    const { tagList, slug, ...otherProperties } = newArticle;
    const tags = getters["tags"]
      .filter(
        (tagObject: TagObject) => tagList?.indexOf(tagObject.value) !== -1
      )
      .map((tag: TagObject) => tag.text);
    return new Promise((resolve, reject) => {
      if (typeof slug === "undefined") {
        commit("endRequestFail", {
          operation: "update",
          error: "Could not edit article! Nothing Found."
        });
        reject();
      } else {
        ArticleDataProvider.update(slug, { ...otherProperties, tagList: tags })
          .then(({ data }) => {
            commit("endRequestSuccess", "update");
            resolve(data);
          })
          .catch(({ response }) => {
            let error: boolean | string = true;
            const { status } = response;
            if (status === 404) {
              error = "Could not edit article! Nothing Found.";
            }
            commit("endRequestFail", { operation: "update", error });
            reject(response);
          });
      }
    });
  },
  deleteArticle({ commit }, slug: string) {
    commit("startRequest", "delete");
    return new Promise((resolve, reject) => {
      ArticleDataProvider.delete(slug)
        .then(() => {
          commit("endRequestSuccess", "delete");
          commit("removeArticle", slug);
          resolve();
        })
        .catch(() => {
          commit("endRequestFail", { operation: "delete", error: true });
          reject();
        });
    });
  }
};
export const getters: GetterTree<ArticleState, RootState> = {
  formattedArticle: state => (slug: string) => {
    const { entities } = state;
    if (!entities) return null;

    const currentArticle = entities[slug];

    if (!currentArticle) return null;

    const { title, description, body, tagList } = currentArticle;
    const tags = tagList.map(tag => tag.split(" ").join("-"));
    return {
      title,
      description,
      body,
      tagList: tags,
      slug
    };
  },
  articles: state => {
    const { allIds, entities } = state;
    if (!entities) return null;

    return allIds?.map((id, index) => {
      const currentArticle: Article = entities[id];
      const { tagList, author, createdAt, body } = currentArticle;
      let excerpt = "";
      if (body.length > 20) {
        excerpt = `${body.substr(0, 17)}...`;
      } else {
        excerpt = body;
      }
      return {
        ...currentArticle,
        index: index + 1,
        tags: tagList.join(", "),
        author: `@${author.username}`,
        created: moment(createdAt).format("MMMM DD, YYYY"),
        excerpt
      };
    });
  },
  tags: state => {
    return state.tagList.map(tag => {
      return {
        text: tag,
        value: tag.split(" ").join("-")
      };
    });
  }
};

export const article: Module<ArticleState, RootState> = {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
};

export default article;
