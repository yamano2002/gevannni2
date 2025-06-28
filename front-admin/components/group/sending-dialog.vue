<template>
  <v-dialog
    v-model="isSubmitting"
    persistent
    width="300"
  >
    <v-card
      color="yellow darken-2"
    >
      <v-card-text>
        登録処理中...
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
  name: 'IsSubmittingDialog',
  computed: {
    ...mapState('group/register', ['isSubmitting'])
  }
};
</script>
<style scoped>
</style>
