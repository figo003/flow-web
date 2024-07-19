/**
 * @author 明浩
 * @time 2020-8-16
 * @dec 全局默认路由
 * */
const routes = [
  {
    path: "/login",
    name: "登录页",
    component: () => import("@/pages/common/views/Login")
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/pages/common/views/Exception/404")
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/pages/common/views/Exception/403")
  }
];

export default routes;
