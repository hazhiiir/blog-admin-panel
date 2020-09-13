<template>
  <div class="register">
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
