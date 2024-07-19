import Vue from "vue";
import VueRouter from "vue-router";
import home1 from "../views/home1.vue";
import home2 from "../views/home2.vue";

import launch from "../views/launch.vue";
import launchForm from "../views/launch-form.vue";
import detailHistory from "../views/detail-history.vue";
import preson1 from "../views/preson1.vue";
import preson2 from "../views/preson2.vue";
import preson3 from "../views/preson3.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home1",
    name: "home1",
    component: home1
    
  },
  {
    path: "/home2",
    name: "home2",
    component: home2
  },
  {
    path: "/launch",
    name: "launch",
    component: launch
  },
  {
    path: "/launch-form",
    name: "launch-form",
    component: launchForm
  },
  {
    path: "/detail-history",
    name: "detail-history",
    component: detailHistory
  },
  {
    path: "/preson1",
    name: "preson1",
    component: preson1
  },
  {
    path: "/preson2",
    name: "preson2",
    component: preson2
  },
  {
    path: "/preson3",
    name: "preson3",
    component: preson3
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
