<template>
  <v-card>
    <v-card-title class="header-area">
      <v-layout justify-space-between>
        <table class="headers">
          <tbody>
            <tr>
              <th>件名</th>
              <td>
                <span v-if="mail.subject"><b>{{ mail.subject }}</b></span>
                <span
                  v-else
                  class="grey--text">未設定</span>
              </td>
            </tr>
            <tr v-if="isSplitFrom">
              <th>差出人名</th>
              <td>
                <span v-if="mail.from_address_name">{{ mail.from_address_name }}</span>
                <span
                  v-else
                  class="grey--text">未設定</span>
              </td>
            </tr>
            <tr>
              <th>差出人アドレス</th>
              <td>
                <span v-if="mail.from_address">{{ mail.from_address }}</span>
                <span
                  v-else
                  class="grey--text">未設定</span>
              </td>
            </tr>
            <tr>
              <th>返信先</th>
              <td>
                <span v-if="mail.reply_to">{{ mail.reply_to }}</span>
                <span
                  v-else
                  class="grey--text">未設定</span>
              </td>
            </tr>
          </tbody>
        </table>

        <slot name="header-right"/>

      </v-layout>
    </v-card-title>
    <v-card-text class="pa-4">
      <v-runtime-template :template="annotatedBody"/>
    </v-card-text>
  </v-card>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';

export default {
  name: 'MailViewerComponent',
  components: { VRuntimeTemplate },
  props: {
    mail: {
      type: Object,
      required: true
    },
    bodyVars: {
      type: Object,
      default() {
        return {};
      }
    },
    isSplitFrom: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    annotatedBody() {
      let body = this.mail.body || '';
      body = this.annotateVars(body);

      return `<pre class="mail-body">${body}</pre>`;
    }
  },
  methods: {
    annotateVars(text) {
      const vars = this.bodyVars;
      Object.keys(vars).forEach(key => {
        const search = `(#{${key}})`;
        const regExp = new RegExp(search, 'g');
        const replace = `<v-tooltip top><span slot="activator" class="tmp-var">$1</span><span>${
          vars[key]
        }</span></v-tooltip>`;
        text = text.replace(regExp, replace);
      });
      return text;
    }
  }
};
</script>

<style scoped lang="stylus">
  .header-area
    border-bottom solid 1px #b3bbbf

  table.headers
    tbody
      th, td
        padding-bottom 4px
      th
        text-align right
        padding-right 14px
        color grey
</style>

<style lang="stylus">
  pre.mail-body
    white-space pre-wrap

  .tmp-var
    color #1a78b3
    border-bottom: dotted 2px #1a78b3;
    cursor pointer
</style>
