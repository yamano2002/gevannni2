<template>
  <v-container grid-list-md>
    <v-form
      ref="form"
      v-model="formValid">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="input.name"
            :rules="rules.name"
            label="リスト名"
            required/>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="input.tag"
            :disabled="!isAdd"
            :rules="rules.tag"
            maxlength="10"
            label="tag"
            hint="プログラム認識用文字列です (半角英数字のみ可、10文字以内)"
            persistent-hint
            required/>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="input.group_id_prefix"
            :disabled="!isAdd"
            :rules="rules.group_id_prefix"
            maxlength="7"
            label="ID prefix"
            hint="団体IDの接頭語です (半角英数字のみ可、7文字以内)"
            persistent-hint
            required/>
        </v-flex>
        <v-layout
          row
          style="margin-top: 20px;">
          <v-flex
            shrink
            style="font-size: 1.2em;">フォームの色</v-flex>
          <v-flex grow>
            <verte
              v-model="input.user_form_color"
              :enable-alpha="false"
              :recent-colors="false"
              picker="square"
              model="rgb"
              menu-position="top"/>
          </v-flex>
        </v-layout>
        <v-flex xs12>
          <v-checkbox
            v-model="input.user_form_enabled"
            label="フォームを有効にする"
          />
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import Verte from 'verte';
import 'verte/dist/verte.css';

export default {
  name: 'ListEditorFormComponent',
  components: { Verte },
  data() {
    return {
      rules: {
        name: [
          v => !!v || '必須項目です',
          v =>
            !this.editorFormNameDuplicated('name') ||
            '他のリストと重複しています'
        ],
        tag: [
          v => !!v || '必須項目です',
          v => /^[a-z0-9_\-]+$/.test(v) || '半角英数字のみを使用してください',
          v =>
            !this.editorFormNameDuplicated('tag') ||
            '他のリストと重複しています'
        ],
        group_id_prefix: [
          v => !!v || '必須項目です',
          v => /^[a-z0-9]+$/.test(v) || '半角英数字のみを使用してください',
          v =>
            !this.editorFormNameDuplicated('group_id_prefix') ||
            '他のリストと重複しています'
        ]
      }
    };
  },
  computed: {
    ...mapState('lists', ['lists']),
    ...mapGetters('lists', ['editorFormNameDuplicated']),
    input: {
      get() {
        return this.$store.state.lists.listEditor.input;
      },
      set(formInput) {
        this.SET_EDITOR_FORM_VALUE(formInput);
      }
    },
    isAdd() {
      return this.$store.state.lists.listEditor.isAdd;
    },
    formValid: {
      get() {
        return this.$store.state.lists.listEditor.formValid;
      },
      set(value) {
        this.UPDATE_FORM_VALID(value);
      }
    }
  },
  methods: {
    ...mapMutations('lists', ['SET_EDITOR_FORM_VALUE', 'UPDATE_FORM_VALID'])
  }
};
</script>

<style scoped>
.verte {
  justify-content: start;
}
</style>
