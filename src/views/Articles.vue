<template>
  <div class="articles">
    <read-articles />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ReadArticles from "@/components/articles/Articles.vue";

@Component({
  components: {
    ReadArticles
  }
})
export default class Home extends Vue {}
</script>
