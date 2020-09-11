<template>
  <form-container title="Register" :secondaryAction="secondaryAction">
    <div class="register-form text-left">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="register-input-group-1"
          label="User"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="newUser.username"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="register-input-group-2"
          label="Email"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="newUser.email"
            type="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="register-input-group-3"
          label="Password"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="newUser.password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" block>Register</b-button>
      </b-form>
    </div>
  </form-container>
</template>

<script lang="ts">
import FormContainer from "./FormContainer.vue";
import { Component, Vue } from "vue-property-decorator";
import { User } from "../../store/types";

@Component({
  components: {
    FormContainer
  }
})
export default class HelloWorld extends Vue {
  private newUser: User = {
    email: "",
    username: "",
    password: ""
  };

  data() {
    return {
      form: {
        email: "",
        user: "",
        password: ""
      },
      secondaryAction: {
        description: "Already Registered?",
        href: "/",
        title: "Login"
      }
    };
  }
  onSubmit() {
    return;
  }
  onReset() {
    return;
  }
}
</script>

<style lang="scss" scoped></style>
