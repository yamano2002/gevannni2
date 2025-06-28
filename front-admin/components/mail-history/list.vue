<template>
  <v-card>
    <v-card-title>
      <v-layout row>
        <v-flex xs7>
          <div v-if="searchQuery">
            <span class="subheading">「<span class="deep-orange--text font-weight-bold">{{ searchQuery }}</span>」の検索結果</span>
            <v-btn 
              color="warning" 
              small 
              depressed 
              @click="clearSearch">
              <v-icon 
                class="mr-2" 
                small>fa-ban</v-icon>
              クリア
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs5>
          <form @submit.prevent="searchMail">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="件名・本文・配信先で検索..."
              single-line
              hint="Enter key で検索"
            />
          </form>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-data-table
      id="SentMailList"
      :headers="tableHeaders"
      :items="sentMails"
      :pagination.sync="pagination"
      :total-items="totalCount"
      :loading="loading"
      :rows-per-page-items="[20, 50, 100]"
      no-data-text="メールが見つかりません"
    >
      <template
        slot="items"
        slot-scope="props">
        <td><nuxt-link :to="`/mail_history/${props.item.id}`"><strong>{{ props.item.subject }}</strong></nuxt-link></td>
        <td style="width: 28%;">{{ props.item.to }}</td>
        <td style="width: 25%;">{{ formatDatetime(props.item.sentAt) }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'MailHistoryListComponent',
  data() {
    return {
      tableHeaders: [
        {
          text: '件名',
          value: 'subject',
          sortable: false
        },
        {
          text: '配信先',
          value: 'to',
          sortable: false
        },
        {
          text: '送信日時',
          value: 'sentAt'
        }
      ]
    };
  },
  computed: {
    ...mapState('mailHistory/list', [
      'sentMails',
      'totalCount',
      'loading',
      'searchQuery'
    ]),
    pagination: {
      get() {
        return this.$store.state.mailHistory.list.pagination;
      },
      set(value) {
        this.SET_PAGINATION(value);
      }
    },
    search: {
      get() {
        return this.$store.state.mailHistory.search;
      },
      set(value) {
        this.SET_SEARCH(value);
      }
    }
  },
  watch: {
    pagination: {
      async handler() {
        await this.getSentMailList();
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('mailHistory', ['SET_SEARCH']),
    ...mapMutations('mailHistory/list', ['SET_PAGINATION']),
    ...mapActions('mailHistory/list', ['getSentMailList']),
    searchMail() {
      if (!this.search) {
        return;
      }
      this.getSentMailList();
    },
    clearSearch() {
      this.search = '';
      this.getSentMailList();
    },
    formatDatetime(str) {
      return this.$moment(str).format('lll');
    }
  }
};
</script>

<style lang="stylus">
  #SentMailList
    table
      width 100%
      td
        max-width 0
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
</style>

<style scoped>
</style>
