<template>
  <v-layout d-block>
    <PageTitle class="mb-3">メールテンプレート</PageTitle>
    <MailTemplateList/>
    <MailTemplateEditor/>
  </v-layout>
</template>

<script>
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import MailTemplateList from '../../components/mail-template/list';
import MailTemplateEditor from '../../components/mail-template/editor';

export default {
  name: 'MailTemplateIndexPage',
  components: { PageTitle, MailTemplateList, MailTemplateEditor },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.MAIL_TEMPLATE]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('mailTemplate/getMailTemplates');
    await store.dispatch('sendMailSetting/getSendMailSettings');
  }
};
</script>

<style scoped>
</style>
