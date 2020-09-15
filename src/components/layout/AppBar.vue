<template>
  <b-container fluid>
    <b-row>
      <b-col col class="header-column-container ">
        <b-navbar
          variant="dark"
          type="dark"
          class="app-bar justify-content-between"
        >
          <div class="header-captions-container">
            <h1>{{ $t("layout.header.title") }}</h1>
            <span v-if="currentUser" class="ml-4">
              {{
                $t("layout.header.greeting", { username: currentUser.username })
              }}
            </span>
          </div>
          <b-button variant="outline-primary" @click="hanldeLogout">{{
            $t("layout.header.action")
          }}</b-button>
        </b-navbar>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Action, namespace } from "vuex-class";
import { User } from "@/store/types";

const authState = namespace("auth", State);
const authAction = namespace("auth", Action);

@Component
export default class AppBar extends Vue {
  @authState("user") currentUser!: User;
  @authAction("logout") logout!: any;

  hanldeLogout() {
    this.logout();
    window.location.href = "/login";
  }
}
</script>
<style lang="scss" scoped>
.header-column-container {
  padding-right: 0;
  padding-left: 0;
}
.app-bar {
  height: 60px;
  z-index: 9999;
  .header-captions-container {
    display: flex;
    align-items: baseline;
    color: white;
    h1 {
      font-size: 22px;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
}
</style>
