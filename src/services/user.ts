import { User } from "../store/types";
import api from "./api";

const UserDataProvider = {
  create(newUser: User) {
    return api.post("users", { user: newUser });
  },
  getOne() {
    return api.get("user");
  }
};

export default UserDataProvider;
