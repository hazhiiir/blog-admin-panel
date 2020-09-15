<template>
  <div class="mt-4 w-100">
    <b-row no-gutters class="title-container">
      <b-col sm="12" md="12" lg="12" xl="12">
        <h2>{{ $t(`articles.${operation}.title`) }}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="article-form text-left" sm="12" md="12" lg="6" xl="6">
        <b-form>
          <b-form-group
            id="article-input-group-1"
            :label="$t(`articles.${operation}.fields.title.label`)"
            label-for="input-1"
            :invalid-feedback="invalidFeedbackMessage('title')"
            :state="!hasError('title')"
          >
            <b-form-input
              id="input-1"
              v-model="$v.newArticle.title.$model"
              type="text"
              :placeholder="
                $t(`articles.${operation}.fields.title.placeholder`)
              "
              required
              autofocus
              @keyup="
                flushRequestError({ operation: operation, field: 'title' })
              "
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="article-input-group-2"
            :label="$t(`articles.${operation}.fields.description.label`)"
            label-for="input-2"
            :invalid-feedback="invalidFeedbackMessage('description')"
            :state="!hasError('description')"
          >
            <b-form-input
              id="input-2"
              v-model="$v.newArticle.description.$model"
              type="text"
              :placeholder="
                $t(`articles.${operation}.fields.description.placeholder`)
              "
              required
              @keyup="
                flushRequestError({
                  operation: operation,
                  field: 'description'
                })
              "
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="article-input-group-3"
            :label="$t(`articles.${operation}.fields.body.label`)"
            label-for="input-3"
            :invalid-feedback="invalidFeedbackMessage('body')"
            :state="!hasError('body')"
            @keyup="flushRequestError({ operation: operation, field: 'body' })"
          >
            <b-form-textarea
              id="input-3"
              v-model="$v.newArticle.body.$model"
              type="text"
              :placeholder="$t(`articles.${operation}.fields.body.placeholder`)"
              rows="8"
              required
            ></b-form-textarea>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col class="tag-form text-left" sm="12" md="12" lg="4" xl="4">
        <b-form-group
          id="tag-input-group-1"
          :label="$t(`articles.${operation}.fields.tagList.label`)"
          label-for="input-1"
        >
          <b-form-input
            id="tag-input-1"
            v-model="newTag"
            type="text"
            :placeholder="
              $t(`articles.${operation}.fields.tagList.placeholder`)
            "
            @keyup.13="addTag"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox-group
            id="article-tags-checkbox-group-1"
            v-model="newArticle.tagList"
            :options="tags"
            name="tagList-1"
            stacked
            class="tags-container"
          ></b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-left" sm="12" md="12" lg="12" xl="12">
        <b-button
          v-if="waiting && waiting[operation]"
          variant="primary"
          disabled
        >
          <b-spinner small type="grow"></b-spinner>
          {{ $t(`articles.${operation}.loadingButton`) }}
        </b-button>
        <b-button
          v-if="!waiting || !waiting[operation]"
          type="button"
          variant="primary"
          :disabled="$v.$invalid"
          @click="onSubmit()"
          >{{ $t(`articles.${operation}.submitButton`) }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Action, State, namespace, Getter, Mutation } from "vuex-class";
import { Article, RequestStateFlagsObject } from "@/store/types";

const articleState = namespace("article", State);
const articleActions = namespace("article", Action);
const articleGetters = namespace("article", Getter);
const articelMutations = namespace("article", Mutation);

@Component({
  mixins: [validationMixin],
  validations: {
    newArticle: {
      title: { required },
      body: { required },
      description: { required }
    }
  }
})
export default class ArticleForm extends Vue {
  private syncInitalValues = false;
  private newTag = "";
  private newArticle: Partial<Article> = {
    title: "",
    body: "",
    description: "",
    tagList: []
  };

  private validationMap: {
    [key in keyof Partial<Article>]: string[];
  } = {
    title: ["required"],
    body: ["required"],
    description: ["required"]
  };

  @Prop() initialValues!: Partial<Article>;
  @Prop({ default: "create" }) operation!: "create" | "update";
  @articleState("error") requestError!: Partial<RequestStateFlagsObject> | null;
  @articleState("waiting") waiting!: Partial<RequestStateFlagsObject> | null;
  @articleGetters("tags") tags!: string[];
  @articelMutations("addTag") addTagToStore: any;
  @articelMutations("flushError") flushRequestError: any;
  @articleActions("createArticle") createArticle: any;
  @articleActions("fetchTags") fetchTags!: any;
  @articleActions("updateArticle") updateArticle!: any;
  mounted() {
    this.fetchTags();
    if (!this.syncInitalValues) {
      this.newArticle = {
        ...this.newArticle,
        ...this.initialValues
      };
      this.syncInitalValues = true;
    }
  }

  addTag() {
    if (!this.newTag) return;

    if (typeof this.newArticle.tagList !== "undefined") {
      this.newArticle.tagList = [
        ...this.newArticle.tagList,
        this.newTag
          .trim()
          .split(" ")
          .join("-")
      ];
      this.addTagToStore(this.newTag);
      this.newTag = "";
    }
  }

  hasError(field: keyof Article): boolean {
    return Boolean(
      (this.requestError &&
        typeof this.requestError[this.operation] !== "boolean" &&
        this.requestError[this.operation] &&
        Boolean((this.requestError[this.operation] as any)[field])) || // shit code!!!!
        this?.$v?.newArticle?.[field]?.$error
    );
  }

  invalidFeedbackMessage(field: keyof Partial<Article>) {
    if (
      this.requestError &&
      typeof this.requestError.delete !== "boolean" &&
      this.requestError.delete &&
      Boolean(this.requestError.delete[field])
    ) {
      return this.requestError.delete[field];
    } else {
      const validations = this.validationMap[field];
      const fieldValidationState = this.$v.newArticle[field];

      if (typeof validations !== "undefined") {
        for (let i = 0; i < validations.length; ++i) {
          const currentRule = validations[i];
          if (
            typeof fieldValidationState !== "undefined" &&
            !fieldValidationState[currentRule]
          ) {
            return this.$t(`articles.fieldValidation.${currentRule}`);
          }
        }
      }
    }
  }
  afterSubmit() {
    this.$router.push({
      name: "Articles"
    });
  }
  onSubmit() {
    if (this.operation === "create") {
      this.createArticle(this.newArticle).then(
        () => {
          this.afterSubmit();
        },
        () => {
          this.afterSubmit();
        }
      );
    } else if (this.operation === "update") {
      this.updateArticle(this.newArticle).then(
        () => {
          this.afterSubmit();
        },
        () => {
          this.afterSubmit();
        }
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.title-container {
  margin-bottom: 26px;
  h2 {
    text-align: left;
    font-size: 40px;
  }
}

.tags-container {
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 17px;
}
</style>
