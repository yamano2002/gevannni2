<template>
  <v-dialog
    v-model="isOpen"
    :persistent="isSaving"
    max-width="450"
  >
    <v-card>
      <v-card-title class="headline">
        リスト
        <span v-if="isAdd">新規追加</span>
        <span v-else>編集</span>
      </v-card-title>

      <v-card-text>
        <v-layout 
          justify-center 
          style="text-align: center;">
          リスト名・tag・ID prefix は他のリストと重複できません。<br>
          また tag・ID prefix は後からの変更はできません。
        </v-layout>
        <ListEditorForm/>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>

        <v-btn
          :disabled="isSaving"
          color="blue darken-1"
          flat="flat"
          @click="CLOSE_EDITOR"
        >
          キャンセル
        </v-btn>

        <v-btn
          :disabled="isSaving"
          :loading="isSaving"
          color="blue darken-1"
          flat="flat"
          @click="saveList"
        >
          登録
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import ListEditorForm from './list-editor-form';

export default {
  name: 'ListEditorComponent',
  components: { ListEditorForm },
  computed: {
    isAdd() {
      return this.$store.state.lists.listEditor.isAdd;
    },
    isOpen: {
      get() {
        return this.$store.state.lists.listEditor.isOpen;
      },
      set(value) {
        if (!value) {
          this.CLOSE_EDITOR();
        }
      }
    },
    isSaving() {
      return this.$store.state.lists.listEditor.isSaving;
    }
  },
  methods: {
    ...mapMutations('lists', ['CLOSE_EDITOR']),
    ...mapActions('lists', ['saveList'])
  }
};
</script>

<style scoped>
</style>
