<template>
  <v-snackbar
    v-model="show"
    :timeout="6000"
    color="success"
    bottom
    vertical
  >
    {{ authCode.sentTo }} に認証コードを送信しました。
    <v-btn
      color="pink"
      flat
      @click="show = false"
    >
      閉じる
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AuthCodeSentNotificationComponent',
  computed: {
    ...mapState('groupRegister/form', ['authCode']),
    show: {
      get() {
        return this.$store.state.groupRegister.form.authCode.isSent;
      },
      set(value) {
        this.$store.commit(
          'groupRegister/form/SWITCH_AUTH_CODE_IS_SENT',
          value
        );
      }
    }
  }
};
</script>

<style scoped>
</style>
