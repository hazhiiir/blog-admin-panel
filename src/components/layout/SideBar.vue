<template>
  <div id="sidebar-container" class="sidebar-expanded">
    <b-list-group>
      <b-list-group-item>
        <span class="title">Title</span>
        <b-list-group class="nested">
          <b-list-group-item>
            <span class="content">test2</span>
          </b-list-group-item>
          <b-list-group-item active>
            <span class="content">test2</span>
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
  background: inherit;
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
</style>
