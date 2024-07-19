import { mergeI18nFromRoutes } from "@/common/utils/others/i18n";
import Router from "vue-router";
import { loginIgnore } from "./index.js";
import { checkAuthorization } from "@/common/api";

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 */
function parseRoutes(routesConfig, routerMap = []) {
  function findRouterCfg(routesConfig, router) {
    let _r = {};
    routesConfig.forEach(item => {
      let _authority =
        router.meta &&
        router.meta.authority &&
        router.meta.authority.permission;
      if (item.permissionString === _authority) {
        _r = item;
        return _r;
      } else if (item.children && item.children.length) {
        _r = findRouterCfg(item.children, router);
      }
    });
    return _r;
  }
  routerMap = routerMap.map(router => {
    let routeCfg = findRouterCfg(routesConfig, router);
    const route = {
      path: routeCfg.url || router.path,
      name: routeCfg.name || router.name,
      component: router.component,
      redirect: router.redirect,
      meta: {
        authority:
          routeCfg.permissionString ||
          (router.meta &&
            router.meta.authority &&
            router.meta.authority.permission) ||
          "*",
        icon: routeCfg.icon || router.meta.icon,
        sortIndex: routeCfg.sortIndex || 9990
      }
    };
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true;
    }
    if (router.children && router.children.length > 0) {
      route.children = parseRoutes(routesConfig, router.children);
    }
    return route;
  });
  return routerMap;
}

/**
 * 加载路由
 * @param router 应用路由实例
 * @param store 应用的 vuex.store 实例
 * @param i18n 应用的 vue-i18n 实例
 * @param routesConfig 路由配置
 */
function loadRoutes({ router, store, i18n }, routesConfig) {
  // 如果 routesConfig 有值，则更新到本地，否则从本地获取
  if (routesConfig) {
    store.commit("account/setRoutesConfig", routesConfig);
  } else {
    routesConfig = store.getters["account/routesConfig"];
  }
  if (routesConfig && routesConfig.length > 0) {
    const routes = parseRoutes(routesConfig, store.state.account["routerMap"]);
    const permissions = store.getters["account/permissions"];
    formatAuthority(routes, permissions);
    const finalRoutes = mergeRoutes(router.options.routes, routes);
    router.options = { ...router.options, routes: finalRoutes };
    router.matcher = new Router({ ...router.options, routes: [] }).matcher;
    router.addRoutes(finalRoutes);
  }
  // 提取路由国际化数据
  mergeI18nFromRoutes(i18n, router.options.routes);
  // 初始化Admin后台菜单数据
  const rootRoute = router.options.routes.find(item => item.path === "/");
  const menuRoutes = rootRoute && rootRoute.children;
  if (menuRoutes) {
    store.commit("setting/setMenuData", menuRoutes);
  }
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
  const routesMap = {};
  target.forEach(item => (routesMap[item.path] = item));
  source.forEach(item => (routesMap[item.path] = item));
  return Object.values(routesMap);
}

/**
 * 登录守卫
 * @param router 应用路由实例
 */
function loginGuard(router) {
  router.beforeEach((to, from, next) => {
    if (!loginIgnore.includes(to) && !checkAuthorization()) {
      next({ path: "/login" });
    } else {
      next();
    }
  });
}

/**
 * 权限守卫
 * @param router 应用路由实例
 * @param store 应用的 vuex.store 实例
 */
function authorityGuard(router, store) {
  router.beforeEach((to, form, next) => {
    const permissions = store.getters["account/permissions"];
    const roles = store.getters["account/roles"];
    if (!hasPermission(to, permissions) && !hasRole(to, roles)) {
      next({ path: "/403" });
    } else {
      next();
    }
  });
}

/**
 * 判断是否有路由的权限
 * @param route 路由
 * @param permissions 用户权限集合
 * @returns {boolean|*}
 */
function hasPermission(route, permissions) {
  const authority = route.meta.authority || "*";
  let required = "*";
  if (typeof authority === "string") {
    required = authority;
  } else if (typeof authority === "object") {
    required = authority.permission;
  }
  return (
    required === "*" ||
    (permissions &&
      permissions.findIndex(
        item => item === required || item.id === required
      ) !== -1)
  );
}

/**
 * 判断是否有路由需要的角色
 * @param route 路由
 * @param roles 用户角色集合
 */
function hasRole(route, roles) {
  const authority = route.meta.authority || "*";
  let required = undefined;
  if (typeof authority === "object") {
    required = authority.role;
  }
  return (
    authority === "*" ||
    (required &&
      roles &&
      roles.findIndex(item => item === required || item.id === required) !== -1)
  );
}

/**
 * 格式化路由的权限配置
 * @param routes
 */
function formatAuthority(routes, permissions) {
  routes.forEach(route => {
    const meta = route.meta;
    if (meta) {
      let authority = {};
      if (!meta.authority) {
        authority.permission = "*";
      } else if (typeof meta.authority === "string") {
        authority.permission = meta.authority;
      } else if (typeof meta.authority === "object") {
        authority = meta.authority;
      } else {
        console.log(typeof meta.authority);
      }
      meta.authority = authority;
    } else {
      route.meta = {
        authority: { permission: "*" }
      };
    }
    if (!hasPermission(route, permissions)) {
      route.meta.invisible = true;
    }
    if (route.children) {
      formatAuthority(route.children, permissions);
    }
  });
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path
    .split("/")
    .filter(item => !item.startsWith(":") && item != "");
  keys.push("name");
  return keys.join(".");
}

export { loadRoutes, loginGuard, authorityGuard, formatAuthority, getI18nKey };
