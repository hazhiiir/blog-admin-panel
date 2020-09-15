<template>
  <div class="articles">
    <article-form
      v-if="article"
      :initialValues="article"
      :operation="'update'"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ArticleForm from "@/components/articles/ArticleForm.vue";
import { Article } from "@/store/types";
import { Action, namespace, Getter } from "vuex-class";

const articleActions = namespace("article", Action);
const articleGetters = namespace("article", Getter);

@Component({
  components: {
    ArticleForm
  }
})
export default class EditArticleView extends Vue {
  private article: Partial<Article> | null = null;

  @articleActions("fetchArticle") fetchArticle: any;
  @articleGetters("formattedArticle") formattedArticle: any;

  redirectToHome() {
    this.$router.push({
      name: "Dashboard"
    });
  }

  mounted() {
    const { slug } = this.$route.params;
    if (!slug) {
      this.redirectToHome();
      return;
    } else {
      this.fetchArticle(slug).then(
        () => {
          this.article = this.formattedArticle(slug);
        },
        () => {
          this.redirectToHome();
        }
      );
    }
  }
}
</script>
