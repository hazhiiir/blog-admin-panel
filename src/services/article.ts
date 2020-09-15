import api from "./api";
import { Article } from "@/store/types";

const ArticleDataProvider = {
  create(newArticle: Partial<Article>) {
    return api.post("articles", {
      article: newArticle
    });
  },
  getOne(slug: string) {
    return api.get("articles", slug);
  },
  getList(params = {}) {
    return api.query("articles", { params });
  },
  delete(slug: string) {
    return api.delete(`articles/${slug}`);
  },
  update(slug: string, params: Partial<Article>) {
    return api.update("articles", slug, { article: params });
  }
};

export default ArticleDataProvider;
