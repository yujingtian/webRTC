import Vue from "vue";
import Router from "vue-router";
import Wap from "./wap/wap"

Vue.use(Router);

export const constantRouterMap = Wap.concat(); //后续可添加模块
export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
