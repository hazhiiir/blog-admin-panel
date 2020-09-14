import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import UIKit from "./ui-kit/";
import VueI18n from "vue-i18n";
import Api from "@/services/api";
import translationsMessages from "../config/translations";

Vue.config.productionTip = false;
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "en",
  messages: translationsMessages
});

Api.init();
UIKit.init();

router.beforeEach((to, from, next) => {
  Promise.all([store.dispatch("auth/fetchCurrentUser")]).then(
    () => {
      if (to.name === "Login" || to.name === "Register") {
        next(false);
      } else {
        next();
      }
    },
    () => {
      if (to.name !== "Login" && to.name !== "Register") {
        next("/login");
      } else {
        next();
      }
    }
  );
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
