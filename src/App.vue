<template>
  <div id="app">
    <app-bar v-if="!isInAuthPage()" />
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "@/components/Layout/AppBar.vue";

@Component({
  components: {
    AppBar
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
