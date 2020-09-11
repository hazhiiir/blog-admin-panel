<template>
  <form-container title="Register" :secondaryAction="secondaryAction">
    <div class="register-form text-left">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="register-input-group-1"
          label="User"
          label-for="input-1"
          :invalid-feedback="userNameInvalidFeedback"
          :state="!$v.newUser.username.$error"
        >
          <b-form-input
            id="input-1"
            v-model="$v.newUser.username.$model"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="register-input-group-2"
          label="Email"
          label-for="input-2"
          :invalid-feedback="emailInvalidFeedback"
          :state="!$v.newUser.email.$error"
        >
          <b-form-input
            id="input-2"
            v-model="$v.newUser.email.$model"
            type="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="register-input-group-3"
          label="Password"
          label-for="input-3"
          :state="!$v.newUser.password.$error"
          :invalid-feedback="passwordInvalidFeedback"
        >
          <b-form-input
            id="input-3"
            v-model="$v.newUser.password.$model"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
          block
          :disabled="$v.newUser.$error"
          @click="() => console.log('test')"
          >Register</b-button
        >
      </b-form>
    </div>
  </form-container>
</template>

<script lang="ts">
import FormContainer from "./FormContainer.vue";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { Component, Vue } from "vue-property-decorator";
import { User } from "../../store/types";

@Component({
  mixins: [validationMixin],
  components: {
    FormContainer
  },
  validations: {
    newUser: {
      username: { required },
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  }
})
export default class RegisterForm extends Vue {
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
  get userNameInvalidFeedback() {
    if (!this?.$v?.newUser?.username?.required) {
      return "Required Field";
    } else return "";
  }
  get emailInvalidFeedback() {
    if (!this?.$v?.newUser?.email?.required) {
      return "Required Field";
    } else if (!this?.$v?.newUser?.email?.email) {
      return "Invalid Format";
    } else {
      return "";
    }
  }
  get passwordInvalidFeedback() {
    if (!this?.$v?.newUser?.password?.required) {
      return "Required Field";
    } else return "";
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
