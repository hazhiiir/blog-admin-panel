import Vue from "vue";
import VueAxios from "vue-axios";
import JWT from "./jwt";
import axios from "axios";
import API_URL from "../../config/HTTP";

const Api = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
    if (JWT.getToken()) {
      this.addAuthorizationHeader();
    }
  },

  addAuthorizationHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JWT.getToken()}`;
  },

  query(resource: string, params: object) {
    return Vue.axios.get(resource, params);
  },

  get(resource: string, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`);
  },

  post(resource: string, params: object) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource: string, slug: string, params: object) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  put(resource: string, params: object) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource: string) {
    return Vue.axios.delete(resource);
  }
};

export default Api;
