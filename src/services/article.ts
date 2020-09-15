import { User } from "../store/types";
import api from "./api";
import API_URL from "config/HTTP";

const ArticleDataProvider = {
  create() {
    return api.post("articles", {});
  },
  getOne(slug: string) {
    return api.get("articles", slug);
  },
  getList(params = {}) {
    return api.query("articles", { params });
  },
  delete(slug: string) {
    return api.delete(`articles/${slug}`);
  }
};

export default ArticleDataProvider;
