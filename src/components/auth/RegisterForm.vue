<template>
  <div class="register-form-root-container">
    <alert ref="alertComponent" :variant="alertVariant">
      <span v-if="success"
        >You are registered successfully. redirecting to dashboard...</span
      >
      <span v-if="requestError">Somthing wrong!</span>
    </alert>
    <form-container
      :title="$t('auth.register.title')"
      :secondaryAction="secondaryAction"
    >
      <div class="register-form text-left">
        <b-form @submit.prevent="onSubmit" @reset="onReset">
          <b-form-group
            id="register-input-group-1"
            :label="$t('auth.register.fields.username.label')"
            label-for="input-1"
            :invalid-feedback="invalidFeedbackMessage('username')"
            :state="!hasError('username')"
          >
            <b-form-input
              id="input-1"
              v-model="$v.newUser.username.$model"
              type="text"
              :placeholder="$t('auth.register.fields.username.placeholder')"
              required
              autofocus
              @keyup="flushRequestError('username')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="register-input-group-2"
            :label="$t('auth.register.fields.email.label')"
            label-for="input-2"
            :invalid-feedback="invalidFeedbackMessage('email')"
            :state="!hasError('email')"
          >
            <b-form-input
              id="input-2"
              v-model="$v.newUser.email.$model"
              type="email"
              :placeholder="$t('auth.register.fields.email.placeholder')"
              required
              @keyup="flushRequestError('email')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="register-input-group-3"
            :label="$t('auth.register.fields.password.label')"
            label-for="input-3"
            :state="!hasError('password')"
            :invalid-feedback="invalidFeedbackMessage('password')"
          >
            <b-form-input
              id="input-3"
              v-model="$v.newUser.password.$model"
              type="password"
              required
              @keyup="flushRequestError('password')"
            ></b-form-input>
          </b-form-group>
          <b-button v-if="waiting" variant="primary" disabled block>
            <b-spinner small type="grow"></b-spinner>
            {{ $t("auth.register.loadingButton") }}
          </b-button>
          <b-button
            v-if="!waiting"
            type="button"
            variant="primary"
            block
            :disabled="$v.$invalid"
            @click="onSubmit()"
            >{{ $t("auth.register.button") }}
          </b-button>
        </b-form>
      </div>
    </form-container>
  </div>
</template>

<script lang="ts">
import FormContainer from "./FormContainer.vue";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { Action, State, Mutation, namespace } from "vuex-class";
import { Component, Vue, Ref } from "vue-property-decorator";
import { User, RegisterFields, ValidationError } from "../../store/types";
import Alert, { AlertVariantProp } from "../common/Alert.vue";

const authState = namespace("auth", State);
const authAction = namespace("auth", Action);
const authMutaion = namespace("auth", Mutation);

@Component({
  mixins: [validationMixin],
  components: {
    FormContainer,
    Alert
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

  private validationMap = {
    username: ["required"],
    email: ["required", "email"],
    password: ["required"]
  };

  private secondaryAction = {
    description: this.$t("auth.register.secondaryAction.desctiption"),
    href: this.$t("auth.register.secondaryAction.href"),
    title: this.$t("auth.register.secondaryAction.title")
  };

  @Ref() alertComponent!: Alert;
  data() {
    return {
      form: {
        email: "",
        user: "",
        password: ""
      }
    };
  }

  @authState("error") requestError!: ValidationError<RegisterFields> | null;
  @authState("waiting") waiting!: boolean;
  @authState("success") success!: boolean;
  @authAction registerUser: any;
  @authMutaion("flushError") flushRequestError: any;

  get alertVariant(): AlertVariantProp {
    if (this.requestError) {
      return "danger";
    } else {
      return "success";
    }
  }

  invalidFeedbackMessage(field: keyof RegisterFields) {
    if (this.requestError && this.requestError[field]) {
      return this.requestError[field];
    } else {
      const validations = this.validationMap[field];
      const fieldValidationState = this.$v.newUser[field];

      for (let i = 0; i < validations.length; ++i) {
        const currentRule = validations[i];
        if (
          typeof fieldValidationState !== "undefined" &&
          !fieldValidationState[currentRule]
        ) {
          return this.$t(`auth.fieldValidation.${currentRule}`);
        }
      }
    }
  }

  hasError(field: keyof RegisterFields): boolean {
    return Boolean(
      (this.requestError && Boolean(this.requestError[field])) ||
        this?.$v?.newUser?.[field]?.$error
    );
  }

  onSubmit() {
    this.registerUser(this.newUser).then(
      () => {
        this.alertComponent.showAlert();
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      },
      () => {
        this.alertComponent.showAlert();
      }
    );
  }

  onReset() {
    return;
  }
}
</script>

<style lang="scss" scoped></style>
