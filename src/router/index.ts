import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Articles from "@/views/Articles.vue";
import CreateArticle from "@/views/CreateArticle.vue";
import EditArticle from "@/views/EditArticle.vue";

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
      }
    ]
  },
  {
    path: "/articles/create",
    name: "CreateArticle",
    component: CreateArticle
  },
  {
    path: "/articles/edit/:slug",
    name: "EditArticle",
    component: EditArticle
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
