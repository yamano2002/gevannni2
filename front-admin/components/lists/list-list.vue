<template>
  <div class="mt-3 elevation-1">
    <table class="v-table theme--light">
      <thead>
        <tr>
          <th>リスト名</th>
          <th>
            tag
            <v-tooltip top>
              <v-btn
                slot="activator"
                small
                icon
                class="ma-0">
                <v-icon
                  small
                  color="blue accent-2"
                >
                  fa-question-circle
                </v-icon>
              </v-btn>
              <span>システムが認識するための文字列です。</span>
            </v-tooltip>
          </th>
          <th>
            ID prefix
            <v-tooltip top>
              <v-btn
                slot="activator"
                small
                icon
                class="ma-0">
                <v-icon
                  small
                  color="blue accent-2"
                >
                  fa-question-circle
                </v-icon>
              </v-btn>
              <span>団体IDの頭に付く文字列です。</span>
            </v-tooltip>
          </th>
          <th>
            フォーム
            <v-tooltip top>
              <v-btn
                slot="activator"
                small
                icon
                class="ma-0">
                <v-icon
                  small
                  color="blue accent-2"
                >
                  fa-question-circle
                </v-icon>
              </v-btn>
              <span>有効の場合に利用者が登録できます。クリックで有効・無効の切り替えが可能です。</span>
            </v-tooltip>
          </th>
          <th>フォームの色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="list in lists" 
          :key="list.id">
          <td>{{ list.name }}</td>
          <td class="text-xs-center">{{ list.tag }}</td>
          <td class="text-xs-center">{{ list.group_id_prefix }}</td>
          <td class="text-xs-center">
            <v-btn 
              v-if="list.user_form_enabled"
              round
              color="success" 
              dark 
              small 
              depressed
              @click="toggleFormEnabled(list.id)">有効</v-btn>
            <v-btn 
              v-else
              round
              color="error"
              dark 
              small 
              depressed
              @click="toggleFormEnabled(list.id)">無効</v-btn>
          </td>
          <td 
            :style="{ backgroundColor: list.user_form_color }" 
            class="text-xs-center">
            {{ list.user_form_color }}
          </td>
          <td class="text-xs-center">
            <v-icon
              small
              class="mr-2"
              @click="openModifyEditor(list.id)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="OPEN_DELETE_CONF(list.id)"
            >
              delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'ListListComponent',
  computed: {
    ...mapState('lists', ['lists'])
  },
  methods: {
    ...mapMutations('lists', ['OPEN_DELETE_CONF']),
    ...mapActions('lists', ['openModifyEditor', 'toggleFormEnabled'])
  }
};
</script>

<style scoped>
</style>
