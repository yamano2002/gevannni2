<template>
  <v-layout d-block>
    <v-flex class="text-xs-center mt-4 mb-5">
      現在、以下の登録を受け付けています。登録をご希望のものを選択してください。
    </v-flex>
    <v-flex 
      d-flex 
      justify-center>
      <v-flex class="xs12 sm9 md6">
        <table class="v-table theme--light elevation-1 text-xs-center">
          <tbody>
            <tr 
              v-for="list in lists" 
              :key="list.tag">
              <td class="pa-2"><b>{{ list.name }}</b></td>
              <td class="pa-2">
                <v-btn
                  flat
                  small 
                  color="primary" 
                  @click="initSequence({ listTag: list.tag, isAdd: true })">新規登録</v-btn>
              </td>
              <td class="pa-2">
                <v-btn 
                  flat 
                  small 
                  color="primary" 
                  @click="initSequence({ listTag: list.tag, isAdd: false })">登録内容変更</v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'ListsComponent',
  computed: {
    ...mapState('lists', ['lists'])
  },
  methods: {
    ...mapActions('groupRegister', ['initSequence'])
  }
};
</script>

<style scoped>
</style>
