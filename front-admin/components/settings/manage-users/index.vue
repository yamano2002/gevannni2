<template>
  <v-layout d-block>
    <v-layout>
      <v-flex>
        <h2 class="mb-2">利用者側認証情報管理</h2>
        <p>
          利用者が登録ページに入るための認証情報を管理します。
        </p>
      </v-flex>
      <v-flex 
        d-flex 
        class="align-self-center shrink">
        <v-btn
          color="primary"
          class="white--text"
          @click="openEditor()"
        >
          <v-icon
            left
            small>fa-plus</v-icon>
          ユーザ作成
        </v-btn>
      </v-flex>
    </v-layout>
    <UserTable/>
    <EditorModal/>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import UserTable from './table';
import EditorModal from './edit-modal';

export default {
  name: 'SettingsManageUserComponent',
  components: { UserTable, EditorModal },
  methods: {
    ...mapActions('settings/manageUsers', ['openEditor'])
  }
};
</script>

<style scoped>
</style>
