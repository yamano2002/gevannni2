const manageUsersModule = {
  namespaced: true,
  state: {
    users: [],
    editor: {
      modalOpen: false,
      values: {},
      saving: false
    }
  },
  getters: {
    findUserById: state => id => {
      return state.users.find(user => user.id === id);
    },
    isAdd: state => {
      return !state.editor.values.id;
    }
  },
  mutations: {
    SET_USERS(state, newUsers) {
      state.users = newUsers;
    },
    SWITCH_EDITOR_OPEN(state, value) {
      state.editor.modalOpen = value;
    },
    INIT_EDITOR(state, userData) {
      state.editor.values = userData;
      state.editor.saving = false;
    },
    SET_SAVING(state, value) {
      state.editor.saving = value;
    },
    UPDATE_VALUES_FROM_EDITOR(state, values) {
      state.editor.values = values;
    }
  },
  actions: {
    async getUsers({ commit }) {
      const res = await this.$axios.get('/user');
      commit('SET_USERS', res.data);
    },
    openEditor({ getters, commit }, targetUserId = null) {
      let userData = {
        id: null,
        name: '',
        password: ''
      };

      const targetUser = getters.findUserById(targetUserId);
      if (targetUser) {
        userData = { ...userData, ...targetUser };
      }

      commit('INIT_EDITOR', userData);
      commit('SWITCH_EDITOR_OPEN', true);
    },
    save({ state, commit, dispatch }) {
      const reqBody = state.editor.values;

      commit('SET_SAVING', true);
      this.$axios
        .put('/user/save', reqBody)
        .then(async res => {
          commit('SWITCH_EDITOR_OPEN', false);
          dispatch(
            'notification/push',
            {
              text: `利用者側ユーザ「${reqBody.name}」を登録しました`,
              type: 'success'
            },
            {
              root: true
            }
          );
          await dispatch('getUsers');
        })
        .catch(e => {
          dispatch(
            'notification/push',
            {
              text: `利用者側ユーザ「${
                reqBody.name
              }」を登録できませんでした。名前が重複してないか確認してください。`,
              type: 'error'
            },
            {
              root: true
            }
          );
        })
        .finally(() => {
          commit('SET_SAVING', false);
        });
    },
    async deleteUser({ getters, dispatch }, userId) {
      const targetUser = getters.findUserById(userId);
      if (!targetUser) {
        return;
      }

      const conf = confirm(
        `利用者側ユーザ「${targetUser.name}」を削除しますか？`
      );
      if (!conf) {
        return;
      }

      await this.$axios.delete('/user/' + userId);
      dispatch(
        'notification/push',
        {
          text: `利用者側ユーザ「${targetUser.name}」を削除しました`,
          type: 'success'
        },
        {
          root: true
        }
      );
      await dispatch('getUsers');
    }
  }
};

export default manageUsersModule;
