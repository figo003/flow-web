import Vue from "vue";
import Router from "vue-router";
import { formatAuthority } from "./routerUtil";
import { store } from "@/data/store";

Vue.use(Router);

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ["404", "403"], //根据路由名称匹配
  paths: ["/login"], //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path);
  }
};

/**
 * 初始化路由实例
 * @param isAsync 是否异步路由模式
 * @returns {VueRouter}
 */
function initRouter(config) {
  store.commit("account/setRouterMap", config);
  const defaultConfig = require("./defaultConfig").default;
  const routes = defaultConfig.concat(config);
  const permissions = store.getters["account/permissions"];
  formatAuthority(routes, permissions);
  return new Router({
    routes
  });
}
export { loginIgnore, initRouter };
