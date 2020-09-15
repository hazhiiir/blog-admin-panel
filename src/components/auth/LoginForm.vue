<template>
  <div class="login-form-root-container">
    <alert ref="alertComponent" :variant="alertVariant">
      <span v-if="success"
        >You are loged in successfully. redirecting to dashboard...</span
      >
      <span v-if="requestError" v-html="getErrorMessage()"></span>
    </alert>
    <form-container
      :title="$t('auth.login.title')"
      :secondaryAction="secondaryAction"
    >
      <div class="login-form text-left">
        <b-form @submit.prevent="onSubmit" @reset="onReset">
          <b-form-group
            id="login-input-group-1"
            :label="$t('auth.login.fields.email.label')"
            label-for="input-1"
            :invalid-feedback="invalidFeedbackMessage('email')"
            :state="!hasError('email')"
          >
            <b-form-input
              id="input-2"
              v-model="$v.currentUser.email.$model"
              type="email"
              :placeholder="$t('auth.login.fields.email.placeholder')"
              required
              autofocus
              @keyup="flushRequestError('email')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="login-input-group-3"
            :label="$t('auth.login.fields.password.label')"
            label-for="input-3"
            :state="!hasError('password')"
            :invalid-feedback="invalidFeedbackMessage('password')"
          >
            <b-form-input
              id="input-3"
              v-model="$v.currentUser.password.$model"
              type="password"
              required
              @keyup="flushRequestError('password')"
            ></b-form-input>
          </b-form-group>
          <b-button v-if="waiting" variant="primary" disabled block>
            <b-spinner small type="grow"></b-spinner>
            {{ $t("auth.login.loadingButton") }}
          </b-button>
          <b-button
            v-if="!waiting"
            type="button"
            variant="primary"
            block
            :disabled="$v.$invalid"
            @click="onSubmit()"
            >{{ $t("auth.login.button") }}
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
import { User, LoginField, ValidationError } from "../../store/types";
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
    currentUser: {
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
export default class LoginForm extends Vue {
  private currentUser: Partial<User> = {
    email: "",
    password: ""
  };

  private validationMap = {
    email: ["required", "email"],
    password: ["required"]
  };

  private secondaryAction = {
    description: this.$t("auth.login.secondaryAction.desctiption"),
    href: this.$t("auth.login.secondaryAction.href"),
    title: this.$t("auth.login.secondaryAction.title")
  };

  @Ref() alertComponent!: Alert;

  @authState("error") requestError!: ValidationError<LoginField> | null;
  @authState("waiting") waiting!: boolean;
  @authState("success") success!: boolean;
  @authAction login: any;
  @authMutaion("flushError") flushRequestError: any;

  get alertVariant(): AlertVariantProp {
    if (this.requestError) {
      return "danger";
    } else {
      return "success";
    }
  }

  invalidFeedbackMessage(field: keyof LoginField) {
    if (this.requestError && this.requestError[field]) {
      return this.requestError[field];
    } else {
      const validations = this.validationMap[field];
      const fieldValidationState = this.$v.currentUser[field];

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

  hasError(field: keyof LoginField): boolean {
    return Boolean(
      (this.requestError && Boolean(this.requestError[field])) ||
        this?.$v?.currentUser?.[field]?.$error
    );
  }

  getErrorMessage() {
    if (this.requestError && this.requestError.message) {
      return this.requestError.message;
    } else {
      return "Somthing wrong!";
    }
  }

  onSubmit() {
    this.login(this.currentUser).then(
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
