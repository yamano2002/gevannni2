<template>
  <v-data-table
    :headers="headers"
    :items="users"
    hide-actions
    class="elevation-1"
  >
    <template 
      slot="items" 
      slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td>********</td>
      <td class="layout">
        <v-icon
          small
          class="mr-2"
          @click="openEditor(props.item.id)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteUser(props.item.id)"
        >
          delete
        </v-icon>
      </td>
    </template>
    <template slot="no-data">
      ユーザが存在しません
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SettingsManageUserComponent',
  data() {
    return {
      headers: [
        { text: 'ユーザ名', sortable: false },
        { text: 'パスワード', sortable: false },
        { text: '操作', sortable: false }
      ]
    };
  },
  computed: {
    ...mapState('settings/manageUsers', ['users'])
  },
  methods: {
    ...mapActions('settings/manageUsers', ['openEditor', 'deleteUser'])
  }
};
</script>

<style scoped>
</style>
