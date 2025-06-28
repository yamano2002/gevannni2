<template>
  <section>
    <h2 class="mb-2">管理者ユーザ管理</h2>
    <p>
      管理画面にログインするためのユーザです。ユーザごとに権限 (Scope) が異なります。<br>
      ユーザの追加や削除・ユーザ名や Scope の変更はできません。パスワードの変更のみ可能です。
    </p>
    <v-data-table
      :headers="tableHeaders"
      :items="users"
      hide-actions
      class="elevation-1"
    >
      <template
        slot="items"
        slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.scopes }}</td>
        <td>
          <v-edit-dialog
            large
            lazy
            save-text="保存"
            cancel-text="キャンセル"
            @open="openChangePswdForm"
            @save="attemptSavePswd(props.item.name)"
          >
            <span>********</span>
            <v-text-field
              slot="input"
              :append-icon="changePswd.isShow ? 'visibility_off' : 'visibility'"
              :type="changePswd.isShow ? 'text' : 'password'"
              v-model="changePswd.value"
              class="pt-4"
              label="新しいパスワード"
              autofocus
              required
              @click:append="changePswd.isShow = !changePswd.isShow"
            />
          </v-edit-dialog>
        </td>
      </template>
      <template slot="no-data">
        ユーザが存在しません
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  name: 'ManageAdminUsersComponent',
  data() {
    return {
      users: [],
      changePswd: {
        isShow: false,
        value: ''
      },
      tableHeaders: [
        { text: 'ユーザ名', sortable: false },
        { text: 'Scope', sortable: false },
        { text: 'パスワード (クリックで編集)', sortable: false }
      ]
    };
  },
  async created() {
    // obtain user list
    const res = await this.$axios.get('/admin_user/list');
    this.users = res.data;
  },
  methods: {
    openChangePswdForm() {
      this.changePswd.value = '';
      this.changePswd.isShow = false;
    },
    async attemptSavePswd(username) {
      await this.$axios.patch('/admin_user/change_password', {
        username: username,
        new_password: this.changePswd.value
      });

      this.$store.dispatch('notification/push', {
        text: `ユーザ「${username}」のパスワードを変更しました`,
        type: 'success'
      });
    }
  }
};
</script>

<style scoped>
</style>
