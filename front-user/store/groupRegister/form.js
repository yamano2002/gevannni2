import REGISTER_GROUP_ERROR from '../../../enums/errors/registerGroup';

const formModule = {
  namespaced: true,
  state: {
    form: {
      valid: false,
      values: {}
    },
    authCode: {},
    idPub: null,
    confirmModalOpen: false,
    submitting: false,
    submitError: null,
    formDefaultValues: {
      name: '',
      name_kana: '',
      BuildingId: null,
      charge_person_name: '',
      tel: '',
      mail: '',
      mail_auth_code: ''
    }
  },
  mutations: {
    INIT(state, _defaultValues = {}) {
      state.form.valid = false;
      const defaultValues = JSON.parse(JSON.stringify(state.formDefaultValues));
      state.form.values = { ...defaultValues, ..._defaultValues };
      state.authCode = {
        sending: false,
        isSent: false,
        sentTo: null
      };
      state.idPub = null;
      state.confirmModalOpen = false;
      state.submitting = false;
      state.submitError = null;
    },
    UPDATE_FORM_VALID(state, value) {
      state.form.valid = value;
    },
    UPDATE_FORM_VALUES(state, formValues) {
      state.form.values = formValues;
    },
    SEND_AUTH_CODE(state) {
      state.authCode.sending = true;
    },
    DONE_SEND_AUTH_CODE(state, mail) {
      state.authCode.sending = false;
      state.authCode.isSent = true;
      state.authCode.sentTo = mail;
    },
    SWITCH_AUTH_CODE_IS_SENT(state, value) {
      state.authCode.isSent = value;
    },
    SWITCH_CONFIRM_MODAL_OPEN(state, value) {
      state.confirmModalOpen = value;
    },
    SWITCH_SUBMITTING(state, value) {
      state.submitting = value;
    },
    SET_SUBMIT_ERROR(state, errorContent) {
      state.submitError = errorContent;
    }
  },
  actions: {
    async sendAuthCode({ state, commit, rootGetters }) {
      const mail = state.form.values.mail;
      const list_tag = rootGetters['groupRegister/targetList'].tag;
      const reqBody = {
        list_tag: list_tag,
        mail: mail
      };

      commit('SEND_AUTH_CODE');
      await this.$axios.post('/auth_code/issue', reqBody);
      commit('DONE_SEND_AUTH_CODE', mail);
    },
    openConfirm({ state, commit }) {
      if (!state.form.valid) {
        return;
      }
      commit('SWITCH_CONFIRM_MODAL_OPEN', true);
    },
    submit({ state, rootState, commit, dispatch }) {
      const reqBody = JSON.parse(JSON.stringify(state.form.values));
      reqBody.list_tag = rootState.groupRegister.targetListTag;

      if (!rootState.groupRegister.isAdd) {
        reqBody.id_pub = rootState.groupRegister.groupIdPub;
        reqBody.modify_token = rootState.groupRegister.modifyToken;
      }

      commit('SWITCH_SUBMITTING', true);
      this.$axios
        .put('/group/register', reqBody)
        .then(res => {
          dispatch('groupRegister/Form2Complete', null, { root: true });
        })
        .catch(e => {
          dispatch('handleSubmitError', e);
        })
        .finally(() => {
          commit('SWITCH_SUBMITTING', false);
          commit('SWITCH_CONFIRM_MODAL_OPEN', false);
        });
    },
    handleSubmitError({ state, commit }, error) {
      let errorContent = {};

      if (!error.response) {
        errorContent.type = 'others';
        errorContent.errMsg = error.message;
      } else {
        const res = error.response.data;
        errorContent.type = res.message;

        switch (res.message) {
          case REGISTER_GROUP_ERROR.GROUP_NAME_DUPLICATED:
            errorContent.groupName = state.form.values.name;
            break;
          case REGISTER_GROUP_ERROR.MAIL_DUPLICATED:
            errorContent.mail = state.form.values.mail;
            break;
          case REGISTER_GROUP_ERROR.MISMATCH_AUTH_CODE:
            errorContent.authCode = state.form.values.mail_auth_code;
            break;
          case REGISTER_GROUP_ERROR.INVALID_MODIFY_TOKEN:
            break;
          default:
            errorContent.type = 'others';
            errorContent.errMsg = res.message;
            break;
        }
      }

      commit('SET_SUBMIT_ERROR', errorContent);
    }
  }
};

export default formModule;
