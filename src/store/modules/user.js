import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
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
      password: password,
    });

    if (data.code === 20000) {
      commit("SET_TOKEN", data.token);
      setToken(data.token);
      return "ok";
    } else {
      Promise.reject(new Error("login fail"));
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
  async logout({ commit, state }) {
    try {
      await logout();
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
    } catch (err) {
      return err;
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
