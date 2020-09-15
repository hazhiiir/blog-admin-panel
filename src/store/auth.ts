import { ActionTree, MutationTree, Module } from "vuex";
import {
  AuthState,
  User,
  RootState,
  RegisterFields,
  ValidationError
} from "./types";
import UserDataProvider from "@/services/user";
import JWT from "@/services/jwt";
import api from "@/services/api";

const state: AuthState = {
  waiting: false,
  error: null,
  success: false,
  user: null,
  isAuthenticated: Boolean(JWT.getToken())
};

const mutations: MutationTree<AuthState> = {
  startRequest(state) {
    state.waiting = true;
    state.error = null;
    state.success = false;
  },
  endRequestSuccess(state) {
    state.waiting = false;
    state.error = null;
    state.success = true;
  },
  endRequestFail(state, error: ValidationError<RegisterFields>) {
    state.waiting = false;
    state.error = error;
  },
  setUser(state, user: User) {
    const { username, email, token } = user;
    if (typeof token !== "undefined") {
      JWT.setToken(token);
      api.addAuthorizationHeader();
    }
    state.user = { username, email };
    state.isAuthenticated = true;
  },
  flushError(state, field?: keyof RegisterFields) {
    if (typeof field !== "undefined") {
      const newErrorObject = Object.assign({}, state.error);
      delete newErrorObject[field];
      const keys = Object.keys(newErrorObject);
      if (keys.length !== 0) {
        state.error = newErrorObject;
      } else {
        state.error = null;
      }
    } else {
      state.error = null;
    }
  },
  purgeUser(state) {
    JWT.deleteToken();
    state.user = null;
    state.isAuthenticated = false;
  }
};

const actions: ActionTree<AuthState, RootState> = {
  registerUser({ commit }, newUser: User) {
    commit("startRequest");
    return new Promise((resolve, reject) => {
      UserDataProvider.create(newUser)
        .then(({ data }) => {
          const { user } = data;
          commit("endRequestSuccess");
          commit("setUser", user);
          resolve(data);
        })
        .catch(({ response }) => {
          const { status, data } = response;
          if (status === 422) {
            commit("endRequestFail", data.errors);
            reject(response);
          }
        });
    });
  },
  login({ commit }, currentUser: Partial<User>) {
    commit("startRequest");
    return new Promise((resolve, reject) => {
      api
        .post("users/login", { user: currentUser })
        .then(({ data }) => {
          const { user } = data;
          commit("endRequestSuccess");
          commit("setUser", user);
          resolve(data);
        })
        .catch(({ response }) => {
          const { status, data } = response;
          if (status === 422) {
            let { errors } = data;
            if (errors["email or password"]) {
              delete errors["email or password"];
              const message =
                "<strong>Login Failed!</strong>  User name and/or Password is invalid";
              errors = { ...errors, message };
            }
            commit("endRequestFail", errors);
            reject(response);
          }
        });
    });
  },
  logout({ commit }) {
    commit("purgeUser");
    api.removeAuthorizationHeader();
  },
  fetchCurrentUser({ commit }) {
    return new Promise((resolve, reject) => {
      commit("startRequest");
      UserDataProvider.getOne()
        .then(({ data }) => {
          const { user } = data;
          commit("endRequestSuccess");
          commit("setUser", user);
          resolve(data);
        })
        .catch(({ response }) => {
          const { data } = response;
          commit("endRequestFail", data?.errors);
          reject(response);
        });
    });
  }
};

export const auth: Module<AuthState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true
};

export default auth;
