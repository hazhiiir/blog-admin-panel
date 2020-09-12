import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import UIKit from "./ui-kit/";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Api from "@/services/api";

Vue.config.productionTip = false;
Api.init();
UIKit.init();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
