<template>
  <v-layout d-block>
    <PageTitle class="mb-3">メール送信設定</PageTitle>
    <SendMailSettingList/>
  </v-layout>
</template>

<script>
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import SendMailSettingList from '../../components/send-mail-setting/list';

export default {
  name: 'SendMailSettingIndexPage',
  components: { PageTitle, SendMailSettingList },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.SEND_MAIL_SETTING]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('sendMailSetting/getSendMailSettings');
  }
};
</script>

<style scoped>
</style>
