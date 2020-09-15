<template>
  <div class="login w-100 p-4">
    <login-form></login-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoginForm from "../components/auth/LoginForm.vue";

@Component({
  components: {
    LoginForm
  }
})
export default class Login extends Vue {}
</script>
