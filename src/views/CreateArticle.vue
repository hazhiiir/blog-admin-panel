<template>
  <div class="articles">
    <create-article />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateArticle from "@/components/articles/ArticleForm.vue";

@Component({
  components: {
    CreateArticle
  }
})
export default class CreateArticleView extends Vue {}
</script>
