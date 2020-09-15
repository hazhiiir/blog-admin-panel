<template>
  <div id="app">
    <app-bar v-if="!isInAuthPage()" />
    <b-row no-gutters>
      <nav-bar v-if="!isInAuthPage()" />
      <router-view :class="{ sapced: !isInAuthPage() }" />
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "@/components/layout/AppBar.vue";
import NavBar from "@/components/layout/SideBar.vue";

@Component({
  components: {
    AppBar,
    NavBar
  }
})
export default class App extends Vue {
  isInAuthPage(): boolean {
    const currentRoute = this.$route.name;
    if (typeof currentRoute === "string") {
      return ["Login", "Register"].indexOf(currentRoute) !== -1;
    } else {
      return false;
    }
  }
}
</script>
<style>
.sapced {
  margin-left: 30px;
  margin-right: 30px;
  flex-grow: 1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
