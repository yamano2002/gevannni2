<template>
  <v-dialog
    v-model="isSending"
    persistent
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        送信中...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CreateMailSendingDialogComponent',
  computed: {
    ...mapState('createMail/editor', ['isSending'])
  }
};
</script>

<style scoped>
</style>
