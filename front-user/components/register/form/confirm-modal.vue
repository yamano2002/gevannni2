<template>
  <v-dialog
    v-model="isOpen"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        確認
      </v-card-title>

      <v-card-text>
        <ConfirmModalContent/>
      </v-card-text>

      <v-card-actions>
        <v-layout row>
          <v-flex
            xs-6
            mx-1>
            <v-btn
              :disabled="submitting"
              block
              depressed
              color="secondary"
              @click="isOpen=false">
              戻る
            </v-btn>
          </v-flex>
          <v-flex
            xs-6
            mx-1>
            <v-btn
              :loading="submitting"
              block
              depressed
              color="primary"
              @click="submit">
              登録
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>

  </v-dialog>

</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ConfirmModalContent from './confirm-modal-content';

export default {
  name: 'ConfirmModalComponent',
  components: { ConfirmModalContent },
  computed: {
    ...mapState('groupRegister/form', ['submitting']),
    isOpen: {
      get() {
        return this.$store.state.groupRegister.form.confirmModalOpen;
      },
      set(value) {
        this.SWITCH_CONFIRM_MODAL_OPEN(value);
      }
    }
  },
  methods: {
    ...mapMutations('groupRegister/form', ['SWITCH_CONFIRM_MODAL_OPEN']),
    ...mapActions('groupRegister/form', ['submit'])
  }
};
</script>

<style scoped>
</style>
