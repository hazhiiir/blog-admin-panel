import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  LayoutPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  ButtonPlugin
} from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(LayoutPlugin);
Vue.use(FormPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(ButtonPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
