import api from "./api";

const TagDataProvider = {
  getList(params = {}) {
    return api.query("tags", { params });
  }
};

export default TagDataProvider;
