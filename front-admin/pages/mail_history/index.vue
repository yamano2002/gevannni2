<template>
  <v-layout d-block>
    <PageTitle class="mb-3">メール送信履歴</PageTitle>
    <MailHstrList/>
  </v-layout>
</template>

<script>
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import MailHstrList from '../../components/mail-history/list';

export default {
  name: 'MailHistoryIndexPage',
  components: { PageTitle, MailHstrList },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [
      scopes.SENT_MAIL_HISTORY,
      scopes.SENT_MAIL_HISTORY_INF
    ]);
    return true;
  }
};
</script>

<style scoped>
</style>
