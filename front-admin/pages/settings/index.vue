<template>
  <v-layout d-block>
    <PageTitle class="mb-4">設定</PageTitle>
    <ManageAdminUser class="mb-5"/>
    <ManageUser class="mb-5"/>
    <ManageApiToken />
  </v-layout>
</template>

<script>
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import ManageAdminUser from '../../components/settings/manage-admin-users';
import ManageUser from '../../components/settings/manage-users/';
import ManageApiToken from '../../components/settings/manage-api-token';

export default {
  name: 'SettingsIndexPage',
  components: { PageTitle, ManageAdminUser, ManageUser, ManageApiToken },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.SETTINGS]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('settings/manageUsers/getUsers');
  }
};
</script>

<style scoped>
</style>
