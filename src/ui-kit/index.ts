import Vue from "vue";
import {
  LayoutPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  ButtonPlugin,
  AlertPlugin,
  SpinnerPlugin,
  NavbarPlugin,
  NavPlugin,
  SidebarPlugin,
  ListGroupPlugin
} from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

const UIKit = {
  init() {
    Vue.use(LayoutPlugin);
    Vue.use(FormPlugin);
    Vue.use(FormGroupPlugin);
    Vue.use(FormInputPlugin);
    Vue.use(ButtonPlugin);
    Vue.use(AlertPlugin);
    Vue.use(SpinnerPlugin);
    Vue.use(NavbarPlugin);
    Vue.use(NavPlugin);
    Vue.use(SidebarPlugin);
    Vue.use(ListGroupPlugin);
  }
};

export default UIKit;
