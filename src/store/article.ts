import { ActionTree, MutationTree, Module, GetterTree } from "vuex";
import {
  ArticleState,
  Article,
  Author,
  CRUDOperations,
  RootState,
  RegisterFields,
  ValidationError,
  PagingParameters
} from "./types";
import { normalize, schema } from "normalizr";
import ArticleDataProvider from "@/services/article";
import api from "@/services/api";
import auth from "./auth";
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
  articlesCount: 0
};

const mutations: MutationTree<ArticleState> = {
  startRequest(state, operation: keyof CRUDOperations) {
    const { waiting, success, error } = state;
    state.waiting = { ...waiting, [operation]: true };
    state.success = { ...success, [operation]: false };
    state.error = null;
    return;
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
  endRequestFail(state, error: ValidationError<RegisterFields>) {
    return;
  },
  flushError(state, field?: keyof RegisterFields) {
    return;
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
        .catch();
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
        .catch(() => reject());
    });
  }
};
export const getters: GetterTree<ArticleState, RootState> = {
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
