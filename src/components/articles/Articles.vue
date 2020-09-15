<template>
  <div class="mt-4 w-100">
    <b-row no-gutters class="title-container">
      <b-col sm="12" md="12" lg="12" xl="12">
        <h2>{{ $t("articles.read.title") }}</h2>
      </b-col>
    </b-row>
    <alert
      ref="deleteSuccessAlert"
      :variant="deleteAlertVariant"
      @dismissed="deleteSuccessAlertDissmissed"
    >
      <span v-if="this.success && this.success.delete">{{
        $t("articles.delete.successMessage")
      }}</span>
      <span v-if="false">Somthing wrong!</span>
    </alert>
    <b-row no-gutters align-h="start">
      <b-col sm="12" md="12" lg="12" xl="12">
        <b-table
          show-empty
          hover
          table-variant="light"
          :items="items"
          :fields="fields"
          head-variant="light"
          :empty-text="$t('articles.read.emptyText')"
          :busy.sync="busyState"
        >
          <template v-slot:cell(actions)="row">
            <b-dropdown :id="`dropdown-${row.index}`" right variant="primary">
              <template v-slot:button-content>
                <span class="mr-2">...</span>
              </template>
              <b-dropdown-item>{{
                $t("articles.read.actions.update")
              }}</b-dropdown-item>
              <b-dropdown-item @click="requestDeleteArticle(row.item.slug)">{{
                $t("articles.read.actions.delete")
              }}</b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle" variant="primary"></b-spinner>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row no-gutters align-h="center">
      <b-col sm="12" md="12" lg="12" xl="12" class="paging-container">
        <b-pagination
          v-if="numberOfPage > 0 && !busyState"
          :total-rows="articlesCount"
          :per-page="rowsPerPage"
          hide-goto-end-buttons
          v-model="currentPage"
          align="center"
          limit="5"
          page-class="pagination-button-container"
        />
      </b-col>
    </b-row>
    <b-modal
      id="articles-delete-modal-1"
      :title="$t('articles.read.deleteModal.title')"
      ok-variant="danger"
      :ok-title="$t('articles.read.deleteModal.buttons.yes')"
      cancel-variant="outline-dark"
      :cancel-title="$t('articles.read.deleteModal.buttons.no')"
      ref="deleteModal"
      @cancel="abortDelete"
      @ok="proceedDelete"
    >
      <p class="my-4">{{ $t("articles.read.deleteModal.caption") }}</p>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Vue, Ref } from "vue-property-decorator";
import { Action, State, namespace, Getter, Mutation } from "vuex-class";
import { RequestStateFlagsObject, PagingParameters } from "@/store/types";
import { BvModal } from "bootstrap-vue";
import Alert from "../common/Alert.vue";
//flushRequestSuccess
const articleState = namespace("article", State);
const articleActions = namespace("article", Action);
const articleGetters = namespace("article", Getter);
const articelMutations = namespace("article", Mutation);

@Component({
  components: {
    Alert
  }
})
export default class Articles extends Vue {
  private selectedArticleForDeleting: string | null = null;
  private rowsPerPage = 10;
  private currentPage = 1;
  private fields = [
    {
      key: "index",
      label: `${this.$t("articles.read.heading.number")}`
    },
    {
      key: "title",
      label: `${this.$t("articles.read.heading.title")}`
    },
    {
      key: "author",
      label: `${this.$t("articles.read.heading.author")}`
    },
    {
      key: "tags",
      label: `${this.$t("articles.read.heading.tags")}`
    },
    {
      key: "excerpt",
      label: `${this.$t("articles.read.heading.excerpt")}`
    },
    {
      key: "created",
      label: `${this.$t("articles.read.heading.created")}`
    },
    {
      key: "actions",
      label: ""
    }
  ];

  @Ref("deleteModal") deleteModal!: BvModal;
  @Ref("deleteSuccessAlert") deleteSuccessAlert!: Alert;
  @articleState("articlesCount") articlesCount!: number;
  @articleState("waiting") waiting!: Partial<RequestStateFlagsObject>;
  @articleState("success") success!: Partial<RequestStateFlagsObject>;
  @articelMutations("flushRequestSuccess") flushRequestSuccess: any;
  @articleActions("fetchArticles") fetchArticles: any;
  @articleActions("deleteArticle") deleteArticle: any;
  @articleGetters("articles") items: any;

  get busyState() {
    if (!this.waiting) return false;
    return this.waiting.read;
  }

  get numberOfPage() {
    if (this.articlesCount > 0) {
      return Math.ceil(this.articlesCount / this.rowsPerPage);
    } else {
      return 0;
    }
  }

  get deleteAlertVariant() {
    if (this.success && this.success.delete) {
      return "success";
    } else {
      return "info";
    }
  }

  loadPageData(currentPage?: number) {
    const paging: PagingParameters = {
      limit: this.rowsPerPage,
      offset: 0
    };
    let page;
    if (typeof currentPage === "number") {
      page = currentPage;
    } else {
      const currentRoute = this.$route.name;
      if (currentRoute === "ArticlesPage") {
        page = parseInt(this.$route.params.page);
      } else {
        page = 1;
      }
      this.currentPage = page;
    }

    paging.offset = (page - 1) * 10;
    this.fetchArticles({ paging, push: false }).then(() => {
      return;
    });
  }

  @Watch("currentPage")
  onPageChange(page: number, oldPage: number) {
    if (page === oldPage) return;
    if (page === parseInt(this.$route.params?.page)) return;

    if (page > 1) {
      this.$router.push({
        name: "ArticlesPage",
        params: {
          page: `${page}`
        }
      });
    } else {
      this.$router.push({ name: "Articles" });
    }
    this.loadPageData(page);
  }

  abortDelete() {
    this.selectedArticleForDeleting = null;
  }

  proceedDelete() {
    this.deleteArticle(this.selectedArticleForDeleting).then(() => {
      if (this.currentPage !== this.numberOfPage) {
        this.fetchArticles({
          push: true,
          paging: {
            limit: 1,
            offset: 10 * this.currentPage - 1
          }
        });
        this.deleteSuccessAlert.showAlert();
      }
    });
  }

  requestDeleteArticle(slug: string) {
    this.selectedArticleForDeleting = slug;
    this.deleteModal.show("articles-delete-modal-1");
  }

  deleteSuccessAlertDissmissed() {
    this.flushRequestSuccess("delete");
  }

  mounted() {
    this.loadPageData();
  }
}
</script>
<style lang="scss">
.title-container {
  margin-bottom: 26px;
  h2 {
    text-align: left;
    font-size: 40px;
  }
}
.pagination-button-container {
  button {
    color: black;
  }
}
</style>
