import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import DrawFlow from "./components/DrawFlow";
// npm install 引入
// import DrawFlow from "draw-flow-chart-demo";
// import "draw-flow-chart-demo/draw-flow-chart-test.css";

import "./style/index.less";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(Element, {});
Vue.use(DrawFlow);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
