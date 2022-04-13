import { login, getInfo } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  logoutRemoveToken,
} from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
};

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const data = await login({
      username: username.trim(),
      password: password.trim(),
    });

    if (data.code === 20000) {
      commit("SET_TOKEN", data.token);
      setToken(data.token, data.refreshToken);
      return "ok";
    } else {
      Promise.reject(new Error("登录失败"));
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    try {
      let data = await getInfo();
      commit("SET_NAME", data.name);
      commit("SET_AVATAR", data.avatar);
      return data;
    } catch (err) {
      return err;
    }
  },

  // user logout
  logout({ commit, state }) {
    logoutRemoveToken(); // 删除存储在cookie中的token
    resetRouter();
    commit("RESET_STATE");
  },

  // refresh token
  async refreshToken({ commit }) {
    commit("SET_TOKEN");
    commit("RESET_STATE");
  },

  // remove token
  async resetToken({ commit }) {
    removeToken(); // must remove  token  first
    commit("RESET_STATE");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
