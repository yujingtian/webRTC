// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import "./assets/js/flexible";
import FastClick from "fastclick";
import router from "./router";
import axios from "axios";
import Store from "./store";
require("es6-promise").polyfill();
import vuex from "vuex";
import MetaInfo from "vue-meta-info";
import "@/assets/js/utils/route-hooks"; // permission control
import cookie from "@/assets/js/common";

Vue.use(MetaInfo);

Vue.use(cookie);
Vue.use(vuex);

router.beforeEach((to, from, next) => {
  next();
});

new Vue({
  el: "#app",
  store: Store,
  router: router,
  render: h => h(App)
});
