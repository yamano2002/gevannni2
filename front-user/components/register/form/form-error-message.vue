<template>
  <div>
    <v-container 
      v-if="submitError" 
      class="err-msg-area error">
      <v-layout 
        v-if="judgeErrorType('name_dup')" 
        d-block>
        <v-flex>団体名「{{ submitError.groupName }}」は既に使われています。</v-flex>
      </v-layout>
      <v-layout
        v-if="judgeErrorType('mail_dup')"
        d-block>
        <v-flex>メールアドレス「{{ submitError.mail }}」は既に使われています。</v-flex>
      </v-layout>
      <v-layout
        v-if="judgeErrorType('mismatch_code')" 
        d-block>
        <v-flex>認証コードが違います。</v-flex>
      </v-layout>
      <v-layout 
        v-if="judgeErrorType('invalid_token')" 
        d-block>
        <v-flex>トークンが無効です。<nuxt-link to="/">トップページ</nuxt-link> に戻り、もう一度最初から操作をやり直してください。</v-flex>
      </v-layout>
      <v-layout 
        v-if="judgeErrorType('others')" 
        d-block>
        <v-flex>不明なエラーが発生しました。<nuxt-link to="/">トップページ</nuxt-link> に戻り、もう一度最初から操作をやり直してください。</v-flex>
        <v-flex>何度もこのメッセージが表示される場合、お手数ですが学生会館窓口までご相談ください。</v-flex>
        <v-flex>(入力内容とエラーメッセージを控えておいてください)</v-flex>
        <v-flex>[Error Message: {{ submitError.errMsg }}]</v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import REGISTER_GROUP_ERROR from '../../../../enums/errors/registerGroup';
import { mapState } from 'vuex';

const ErrorAlias = {
  name_dup: REGISTER_GROUP_ERROR.GROUP_NAME_DUPLICATED,
  mail_dup: REGISTER_GROUP_ERROR.MAIL_DUPLICATED,
  mismatch_code: REGISTER_GROUP_ERROR.MISMATCH_AUTH_CODE,
  invalid_token: REGISTER_GROUP_ERROR.INVALID_MODIFY_TOKEN,
  others: 'others'
};

export default {
  name: 'FormErrorMessageComponent',
  computed: {
    ...mapState('groupRegister/form', ['submitError'])
  },
  methods: {
    judgeErrorType(errorType) {
      if (!this.submitError) {
        return false;
      }

      return this.submitError.type === ErrorAlias[errorType];
    }
  }
};
</script>

<style scoped lang="stylus">
.err-msg-area
  @extend .mt-4
  @extend .pa-3
  @extend .font-weight-bold
  color white
  border-radius 4px
  .layout
    .flex:not(:last-child)
      @extend .mb-3
</style>
