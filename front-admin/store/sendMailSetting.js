import SEND_MAIL_SETTING_TAG from '../../enums/sendMailSettingTag';

const sendMailSettingModule = {
  namespaced: true,
  state: {
    sendMailSettings: [],
    editorTargetTag: null,
    editorValue: null
  },
  getters: {
    findByTag: state => tag => {
      return state.sendMailSettings.find(item => item.tag === tag);
    },
    mailDomain: (state, getters) => {
      return getters.findByTag(SEND_MAIL_SETTING_TAG.FROM_ADDRESS_DOMAIN).value;
    },
    footerSign: (state, getters) => {
      return getters.findByTag(SEND_MAIL_SETTING_TAG.MAIL_FOOTER_SIGN).value;
    }
  },
  mutations: {
    SET_SEND_MAIL_SETTINGS(state, newSendMailSettings) {
      state.sendMailSettings = newSendMailSettings;
    },
    INIT_EDITOR(state, { tag, value }) {
      state.editorTargetTag = tag;
      state.editorValue = value;
    }
  },
  actions: {
    async getSendMailSettings({ commit }) {
      const res = await this.$axios.get('/send_mail_setting');
      commit('SET_SEND_MAIL_SETTINGS', res.data);
    },
    initEditor({ getters, commit }, targetTag) {
      const targetItem = getters.findByTag(targetTag);
      commit('INIT_EDITOR', {
        tag: targetTag,
        value: targetItem.value
      });
    },
    async save({ state, getters, commit, dispatch }, targetTag) {
      const targetItem = getters.findByTag(targetTag);
      await dispatch('saveToServer', {
        tag: targetTag,
        value: targetItem.value
      });

      dispatch(
        'notification/push',
        {
          text: `メール送信設定「${targetItem.name}」を設定しました`,
          type: 'success'
        },
        {
          root: true
        }
      );
    },
    async clear({ getters, dispatch }, targetTag) {
      const targetItem = getters.findByTag(targetTag);
      const conf = confirm(`「${targetItem.name}」の設定をクリアしますか？`);
      if (!conf) {
        return;
      }

      await dispatch('saveToServer', {
        tag: targetTag,
        value: null
      });
      dispatch(
        'notification/push',
        {
          text: `メール送信設定「${targetItem.name}」をクリアしました`,
          type: 'success'
        },
        {
          root: true
        }
      );
    },
    async saveToServer({ dispatch }, reqBody) {
      await this.$axios.put('send_mail_setting/save', reqBody);
      await dispatch('getSendMailSettings');
    }
  }
};

export default sendMailSettingModule;
