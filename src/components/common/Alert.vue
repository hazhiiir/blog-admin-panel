<template>
  <b-container class="alert" fluid>
    <b-row align-h="end">
      <b-col sm="12" md="6" lg="4" xl="4">
        <b-alert :variant="variant" dismissible v-model="show">
          <slot></slot>
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export type AlertVariantProp =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

@Component
export default class Alert extends Vue {
  private show = false;
  @Prop() private variant!: AlertVariantProp;

  showAlert() {
    this.show = true;
  }
  dissmissAlert() {
    this.show = false;
  }
}
</script>
