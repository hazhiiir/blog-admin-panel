<template>
  <div id="sidebar-container" class="sidebar-expanded">
    <b-list-group>
      <b-list-group-item>
        <span class="title">{{ $t("layout.sidebar.title") }}</span>
        <b-list-group class="nested">
          <b-list-group-item :to="dashboardRoute" exact>
            <span class="content">{{ $t("layout.sidebar.main") }}</span>
          </b-list-group-item>
          <b-list-group-item exact to="/articles/create">
            <span class="content">{{ $t("layout.sidebar.secondary") }}</span>
          </b-list-group-item>
        </b-list-group>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { User } from "@/store/types";
const authState = namespace("auth", State);

@Component
export default class NavBar extends Vue {
  @authState("user") currentUser!: User;

  get dashboardRoute() {
    const { name } = this.$route;
    if (name === "Articles") {
      return {
        name: "Articles"
      };
    } else if (name === "ArticlesPage") {
      return {
        name: "ArticlesPage"
      };
    } else {
      return {
        name: "Dashboard"
      };
    }
  }
}
</script>
<style lang="scss" scoped>
#sidebar-container {
  min-height: 100vh;
  background-color: #1c7cd5;
  padding: 0;
}

.sidebar-expanded {
  width: 250px;
}

.list-group-item {
  border: none;
  background: inherit;
  color: white;
  cursor: pointer;
  .title {
    font-size: 22px;
  }
  .content {
    font-size: 18px;
  }
}
.list-group {
  border-radius: 0;
  border: none;
  text-align: left;
  position: relative;
  &.nested {
    width: 100%;
  }
}
.list-group-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0 -1.25rem;
  & .content {
    padding: 0 1.25rem;
  }
}
.list-group-item-action:hover,
.list-group-item-action:focus {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  width: 250px;
  margin: 0 -1.25rem;
  & .content {
    padding: 0 1.25rem;
  }
}
.router-link-active,
.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.15);
  width: 250px;
  margin: 0 -1.25rem;
  & .content {
    padding: 0 1.25rem;
  }
}
</style>
