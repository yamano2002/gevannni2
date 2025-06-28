<template>
  <div>
    <MailEditor 
      v-model="isOpen" 
      :input="input" 
      :variables="variables">
      <div 
        v-if="getEditTargetTemplate" 
        slot="title">メールテンプレート「{{ getEditTargetTemplate.name }}」編集</div>

      <v-btn
        slot="toolbar-items"
        :loading="editor.isSaving"
        dark
        flat
        @click="save">
        <v-icon class="mr-3">fa-save</v-icon>
        保存
      </v-btn>

      <v-flex xs12>
        <v-checkbox
          v-model="input.has_sign"
          label="署名フッターを含める"
          append-icon="fa-question-circle"
          @click:append="toggleFooterSignShow"
        />
        <v-expand-transition>
          <div v-if="footerSignShow">
            <div>以下を本文の下に付加します</div>
            <pre>{{ footerSign }}</pre>
          </div>
        </v-expand-transition>
      </v-flex>
    </MailEditor>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import MailEditor from '../common/mail-editor';

export default {
  name: 'MailTemplateEditorComponent',
  components: { MailEditor },
  data() {
    return {
      footerSignShow: false
    };
  },
  computed: {
    ...mapState('mailTemplate', ['editor']),
    ...mapGetters('sendMailSetting', ['footerSign']),
    ...mapGetters('mailTemplate', ['getEditTargetTemplate']),
    isOpen: {
      get() {
        return this.editor.isOpen;
      },
      set(value) {
        if (!value) {
          this.CLOSE_EDITOR();
        }
      }
    },
    input: {
      get() {
        return this.editor.input;
      },
      set(formInput) {
        this.SET_EDITOR_FORM_VALUE(formInput);
      }
    },
    variables() {
      return this.getEditTargetTemplate
        ? this.getEditTargetTemplate.variables
        : {};
    }
  },
  methods: {
    ...mapMutations('mailTemplate', ['SET_EDITOR_FORM_VALUE', 'CLOSE_EDITOR']),
    ...mapActions('mailTemplate', ['save']),
    toggleFooterSignShow() {
      this.footerSignShow = !this.footerSignShow;
    }
  }
};
</script>

<style scoped>
</style>
