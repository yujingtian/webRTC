import axios from "axios";
import store from "@/store";
import Vue from "vue";
import * as interceptor from "./interceptor";
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
  //baseURL: process.env.BASE_API, // api的base_url
  timeout: 6000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    if (config.method.toLowerCase() == "get" && !config.params && config.data) {
      config.params = config.data;
    }
    if (config.method == "post") {
      config.data = interceptor.getFormResult(config.data);
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
    if (res.statuscode != undefined && res.statuscode != 10000) {
      Vue.$vux.toast.text(res.message || "系统错误", "middle");
      return Promise.reject("error");
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    // Vue.$vux.toast.text("网络可能开小差了，请稍等", "middle");
    return Promise.reject(error);
  }
);

export default service;
