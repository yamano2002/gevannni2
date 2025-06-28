const authGroupModule = {
  namespaced: true,
  state: {
    form: {
      valid: false,
      values: {
        id_pub: '',
        mail: ''
      }
    },
    submitting: false,
    authFailed: false
  },
  mutations: {
    INIT(state) {
      state.form = {
        valid: false,
        values: {
          id_pub: '',
          mail: ''
        }
      };
      state.submitting = false;
      state.authFailed = false;
    },
    UPDATE_FORM_VALID(state, value) {
      state.form.valid = value;
    },
    UPDATE_FORM_VALUES(state, { id_pub, mail }) {
      state.form.values.id_pub = id_pub;
      state.form.values.mail = mail;
    },
    SWITCH_SUBMITTING(state, value) {
      state.submitting = value;
    },
    AUTH_FAILED(state) {
      state.authFailed = true;
    }
  },
  actions: {
    submit({ state, commit, dispatch, rootGetters }) {
      if (!state.form.valid || state.submitting) {
        return;
      }

      const listTag = rootGetters['groupRegister/targetList'].tag;
      const reqBody = {
        list_tag: listTag,
        ...state.form.values
      };

      commit('SWITCH_SUBMITTING', true);
      this.$axios
        .post('/modify_token/issue', reqBody)
        .then(res => {
          dispatch(
            'groupRegister/AuthGroup2Form',
            { ...res.data, idPub: state.form.values.id_pub },
            { root: true }
          );
        })
        .catch(e => {
          commit('AUTH_FAILED');
        })
        .finally(() => {
          commit('SWITCH_SUBMITTING', false);
        });
    }
  }
};

export default authGroupModule;
