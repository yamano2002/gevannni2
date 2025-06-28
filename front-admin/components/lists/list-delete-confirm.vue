<template>
  <v-dialog
    v-model="isOpen"
    :persistent="isDeleting"
    max-width="350"
  >
    <v-card>
      <v-card-title class="headline">
        リスト削除
      </v-card-title>

      <v-card-text>
        <v-layout
          justify-center
          style="text-align: center;">
          リスト「{{ deleteTargetListName }}」を削除しますか？
        </v-layout>
        <v-layout
          justify-center
          class="red--text mt-4 font-weight-bold"
          style="text-align: center;">
          この操作は後から取り消せません。
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>

        <v-btn
          :disabled="isDeleting"
          color="blue darken-1"
          flat="flat"
          @click="CLOSE_DELETE_CONF"
        >
          キャンセル
        </v-btn>

        <v-btn
          :disabled="isDeleting"
          :loading="isDeleting"
          color="red darken-1"
          flat="flat"
          @click="deleteList"
        >
          削除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ListDeleteConfirmComponent',
  computed: {
    ...mapGetters('lists', ['deleteTargetListName']),
    isOpen: {
      get() {
        return this.$store.state.lists.deleteConfirm.isOpen;
      },
      set(value) {
        if (!value) {
          this.CLOSE_DELETE_CONF();
        }
      }
    },
    isDeleting() {
      return this.$store.state.lists.deleteConfirm.isDeleting;
    }
  },
  methods: {
    ...mapMutations('lists', ['CLOSE_DELETE_CONF']),
    ...mapActions('lists', ['deleteList'])
  }
};
</script>

<style scoped>
</style>
