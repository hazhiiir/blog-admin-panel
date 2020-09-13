<template>
  <div class="register">
    <register-form></register-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RegisterForm from "../components/auth/RegisterForm.vue";

@Component({
  components: {
    RegisterForm
  }
})
export default class Register extends Vue {}
</script>
