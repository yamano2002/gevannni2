<template>
  <v-layout d-block>
    <v-layout justify-space-between>
      <PageTitle>リスト一覧</PageTitle>
      <v-btn
        color="primary"
        class="white--text"
        @click="openAddEditor"
      >
        <v-icon 
          left 
          small>fa-plus</v-icon>
        新規リスト追加
      </v-btn>
    </v-layout>
    <ListList/>
    <ListEditor/>
    <ListDeleteConfirm/>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import ListList from '../../components/lists/list-list';
import ListEditor from '../../components/lists/list-editor';
import ListDeleteConfirm from '../../components/lists/list-delete-confirm';

export default {
  name: 'ListsIndexPage',
  components: { PageTitle, ListList, ListEditor, ListDeleteConfirm },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.LIST]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('lists/getLists');
  },
  methods: {
    ...mapActions('lists', ['openAddEditor'])
  }
};
</script>

<style scoped>
</style>
