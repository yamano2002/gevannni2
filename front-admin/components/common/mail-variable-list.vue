<template>
  <div>
    <v-menu
      v-model="open"
      :close-on-click="false"
      :close-on-content-click="false"
      offset-x
    >
      <v-btn
        slot="activator"
        color="indigo"
        dark
      >
        メール本文中で使用可能な変数
      </v-btn>

      <v-card>
        <table class="variables">
          <tbody>
            <tr 
              v-for="(desc, key) in variables" 
              :key="key">
              <th>{{ stylizedVar(key) }}</th>
              <td>{{ desc }}</td>
            </tr>
          </tbody>
        </table>

        <v-card-actions>
          <v-btn 
            color="primary" 
            block 
            depressed 
            @click="open = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'MailVariableList',
  props: {
    variables: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    stylizedVar(text) {
      return '#{' + text + '}';
    }
  }
};
</script>

<style scoped lang="stylus">
table.variables
  padding 7px
  th, td
    padding 3px 6px
</style>
