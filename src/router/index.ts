import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Articles from "@/views/Articles.vue";
Vue.use(VueRouter);
import { Component } from "vue-property-decorator";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteUpdate",
  "beforeRouteLeave"
]);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Dashboard",
    redirect: {
      name: "Articles"
    }
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: 'about' */ "../views/About.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/articles/page/1",
    redirect: { name: "Articles" }
  },
  {
    path: "/articles",
    name: "Articles",
    component: Articles,
    children: [
      {
        path: "page/:page",
        name: "ArticlesPage",
        component: Articles
      },
      {
        path: "/create",
        name: "CreateArticle"
      },
      {
        path: "/edit/:slug",
        name: "EditArticle"
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
