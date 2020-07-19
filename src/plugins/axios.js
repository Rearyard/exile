"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '../router/index'
import store from '../store/index'
import ViewUI from 'view-design'
import cookie from "js-cookie";
const csrfToken = cookie.get("csrfToken");
const AUTH_TOKEN = 'Bearer ' + store.state.user.token
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['x-csrf-token'] = csrfToken;
axios.defaults.headers.delete['x-csrf-token'] = csrfToken;

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    if (error.response.status==401) {
      if(error.request.responseURL.indexOf('/api/auth/login')==-1){
        ViewUI.Notice.warning({title:'登录过期，请重新登陆',duration:1})
        router.push({path:'/login',query: { from: router.currentRoute.fullPath }})
      }
    }
    if (error.response.status==403){
      ViewUI.Modal.error({
        title: "抱歉",
        content: "您无权做此操作",
        onOk: () => {
          router.back();
        }
      })
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
