<template>
  <div class="auth-form-container">
    <b-container fluid>
      <b-row class="min-vh-100" align-h="center" align-v="center">
        <b-col
          xl="3"
          lg="5"
          md="6"
          sm="9"
          class="main-container"
          align-self="center"
        >
          <header>
            <h1>{{ title }}</h1>
          </header>
          <div class="form">
            <slot></slot>
          </div>
          <footer>
            <p>{{ secondaryAction.description }}</p>
            <router-link :to="secondaryAction.href">{{
              secondaryAction.title
            }}</router-link>
          </footer>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
interface SecondaryAction {
  description: string;
  title: string;
  href: string;
}

@Component
export default class FormContainer extends Vue {
  @Prop() private title!: string;
  @Prop() private secondaryAction!: SecondaryAction;
}
</script>

<style lang="scss" scoped>
@use "@styles/settings.scss" as theme;

.main-container {
  background-color: #eceeef;
  padding: 0 theme.spacing(2);
  @include theme.respondTo("sm") {
    min-width: 450px;
  }
  header {
    margin-top: theme.spacing(3.5);
    margin-bottom: theme.spacing(4.8);
    h1 {
      font-size: 48px;
      color: #707077;
    }
  }
  .form {
    margin-bottom: theme.spacing(1.5);
  }
  footer {
    display: flex;
    align-items: baseline;
    margin-bottom: theme.spacing(1.8);
    padding-left: theme.spacing(0.8);
    a {
      @include theme.typoGraphy;
      font-weight: 700;
    }
    p {
      @include theme.typoGraphy;
      margin-right: theme.spacing(1.2);
      margin-bottom: 0;
    }
  }
}
</style>
