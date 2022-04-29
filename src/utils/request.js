import axios from "axios";
import store from "@/store";
import { getToken } from "@/utils/auth";
import authService from "./authRequest";

let noLock = true;

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters.token) {
      const token = getToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 错误判断，来进行错误的处理
    if (res.code !== 20000 && res.code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    const res = error.response;
    console.log("err" + error); // for debug

    if (res.status === 405 && noLock) {
      noLock = false;
      setTimeout(() => {
        noLock = true;
      }, 2000);

      authService({
        url: "/auth/refresh/token",
        method: "get",
      });
      return;
    }

    if (res.status !== 401 && res.status !== 405) {
      console.log(res.status !== 401 || res.status !== 405);
      Message({
        message: "服务器请求异常！",
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
