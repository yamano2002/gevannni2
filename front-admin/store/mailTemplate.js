const mailTemplateModule = {
  namespaced: true,
  state: {
    mailTemplates: [],
    editor: {
      isOpen: false,
      isSaving: false,
      input: {}
    }
  },
  getters: {
    findTemplateByTag: state => tag => {
      return state.mailTemplates.find(item => item.tag === tag);
    },
    getEditTargetTemplate: (state, getters) => {
      const targetTag = state.editor.input.tag;
      return targetTag && getters.findTemplateByTag(targetTag);
    }
  },
  mutations: {
    SET_MAIL_TEMPLATES(state, newMailTemplates) {
      state.mailTemplates = newMailTemplates;
    },
    SET_EDITOR_FORM_VALUE(state, values) {
      state.editor.input = {
        tag: values.tag,
        has_sign: values.has_sign,
        from_address_name: values.from_address_name,
        from_address_local_part: values.from_address_local_part,
        reply_to: values.reply_to,
        subject: values.subject,
        body: values.body
      };
    },
    OPEN_EDITOR(state) {
      state.editor.isOpen = true;
      state.editor.isSaving = false;
    },
    CLOSE_EDITOR(state) {
      state.editor.isOpen = false;
      state.editor.isSaving = false;
    },
    SAVING(state) {
      state.editor.isSaving = true;
    }
  },
  actions: {
    async getMailTemplates({ commit }) {
      const res = await this.$axios.get('/mail_template');
      commit('SET_MAIL_TEMPLATES', res.data);
    },
    openEditor({ getters, commit }, tag) {
      const targetTmp = getters.findTemplateByTag(tag);
      commit('SET_EDITOR_FORM_VALUE', targetTmp);
      commit('OPEN_EDITOR');
    },
    async save({ state, getters, commit, dispatch }) {
      const targetTmpName = getters.getEditTargetTemplate.name;
      const conf = confirm(
        `メールテンプレート「${targetTmpName}」の変更を保存しますか？`
      );
      if (!conf) {
        return;
      }

      commit('SAVING');
      const reqBody = state.editor.input;
      await this.$axios.put('/mail_template/save', reqBody);
      await dispatch('getMailTemplates');

      commit('CLOSE_EDITOR');
      dispatch(
        'notification/push',
        {
          text: `メールテンプレート「${targetTmpName}」の変更を保存しました`,
          type: 'success'
        },
        {
          root: true
        }
      );
    }
  }
};

export default mailTemplateModule;
