import Vue from "vue";
import {
  LayoutPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  ButtonPlugin,
  AlertPlugin
} from "bootstrap-vue";

const UIKit = {
  init() {
    Vue.use(LayoutPlugin);
    Vue.use(FormPlugin);
    Vue.use(FormGroupPlugin);
    Vue.use(FormInputPlugin);
    Vue.use(ButtonPlugin);
    Vue.use(AlertPlugin);
  }
};

export default UIKit;
