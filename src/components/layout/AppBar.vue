<template>
  <b-container fluid>
    <b-row>
      <b-col col="12" class="header-column-container">
        <b-navbar variant="dark" type="dark" class="app-bar">
          <div class="header-captions-container">
            <h1>{{ $t("layout.header.title") }}</h1>
            <span v-if="currentUser" class="ml-4">
              {{
                $t("layout.header.greeting", { username: currentUser.username })
              }}
            </span>
          </div>
        </b-navbar>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { User } from "@/store/types";
const authState = namespace("auth", State);

@Component
export default class AppBar extends Vue {
  @authState("user") currentUser!: User;
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
