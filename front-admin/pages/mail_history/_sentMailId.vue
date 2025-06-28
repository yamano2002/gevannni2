<template>
  <v-layout d-block>
    <v-btn 
      nuxt 
      to="/mail_history" 
      flat 
      color="primary">
      <v-icon 
        small 
        class="mr-2">fa-arrow-left</v-icon>
      戻る
    </v-btn>

    <PageTitle class="mt-3">送信済みメール閲覧</PageTitle>

    <MailViewer 
      :is-split-from="false" 
      :mail="mailData"
      :body-vars="bodyVars"
      class="mt-3">
      <div slot="header-right">
        送信日時: {{ formatedDatetime }}
      </div>
    </MailViewer>

    <DestList 
      :dests="Groups" 
      :show-bldg="false" 
      header-title="配信先" 
      class="mt-4"/>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import groupBy from 'lodash/groupBy';
import scopes from '../../../enums/adminScopes';
import tmpTag from '../../../enums/mailTmpTag';
import PageTitle from '../../components/common/page-title';
import MailViewer from '../../components/common/mail-viewer';
import DestList from '../../components/common/destinations/list';

export default {
  name: 'MailHistoryViewPage',
  components: { PageTitle, MailViewer, DestList },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [
      scopes.SENT_MAIL_HISTORY,
      scopes.SENT_MAIL_HISTORY_INF
    ]);
    return true;
  },
  asyncData({ app, params, error }) {
    const sentMailId = params.sentMailId;

    return app.$axios
      .get(`/mail_history/${sentMailId}`)
      .then(res => {
        const Groups = groupBy(res.data.Groups, 'ListId');
        return {
          ...res.data,
          sentMailId,
          Groups
        };
      })
      .catch(e => {
        error({
          statusCode: 400,
          message: 'Mail does not exist.'
        });
      });
  },
  async fetch({ store }) {
    await store.dispatch('mailTemplate/getMailTemplates');
    await store.dispatch('lists/getLists');
  },
  computed: {
    ...mapGetters('mailTemplate', ['findTemplateByTag']),
    mailData() {
      return {
        from_address: this.from_address,
        reply_to: this.reply_to,
        subject: this.subject,
        body: this.body
      };
    },
    bodyVars() {
      const tag = tmpTag.MAILING_LIST_TMP;
      return this.findTemplateByTag(tag).variables;
    },
    formatedDatetime() {
      return this.$moment(this.sentAt).format('lll');
    }
  }
};
</script>

<style scoped>
</style>
