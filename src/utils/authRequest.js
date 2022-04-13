import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getRefreshToken, refreshToken } from "@/utils/auth";

let noLock = true;

const authService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

// 请求拦截器
authService.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      const refreshToken = getRefreshToken();
      config.headers.Authorization = `Bearer ${refreshToken}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
authService.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code === 20000) {
      refreshToken(res.token);
      location.reload();
      return res;
    }
  },
  (error) => {
    const res = error.response;
    console.log("err" + error); // for debug
    console.log("hi");
    if (res.status === 401 && noLock) {
      noLock = false;
      setTimeout(() => {
        noLock = true;
      }, 2000);
      // to re-login
      MessageBox.confirm(
        "登录过时，您可以取消以留在此页面，或重新登录。",
        "确定信息",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "关闭",
          type: "warning",
        }
      ).then(() => {
        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      });
      return;
    }

    return Promise.reject(error);
  }
);

export default authService;
