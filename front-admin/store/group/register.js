import cloneDeep from 'lodash/cloneDeep';

const registerModule = {
  namespaced: true,
  state: {
    modalOpen: false, //register-modal
    formValid: false, //check when closing
    addModalOpen: false, //addgroup-modal
    isSubmitting: false, //progressing dialog
    selectedList: null, //selected listId in register-modal
    addedGroups: [], //the array of values
    values: {}, //store the value of add-group form
    modifyValues: {
      values: {}, // values of modified groups
      isModify: false, //true when modifying one group
      index: null //index of modifying group in addedGroups
    },
    addCsvModalOpen: false // csv-add page
  },
  mutations: {
    SWITCH_OPEN(state, Obj) {
      switch (
        Obj.modal //change according to type
      ) {
        case 'register':
          state.modalOpen = Obj.value;
          break;
        case 'add':
          state.addModalOpen = Obj.value;
          break;
        case 'modify':
          state.modifyValues.isModify = Obj.value;
          break;
        case 'add-csv':
          state.addCsvModalOpen = Obj.value;
      }
    },
    SELECT_LIST(state, listid) {
      state.selectedList = listid;
    },
    INIT_VALUES(state) {
      state.values = {};
    },
    SET_ADDFORM_VALID(state, value) {
      state.formValid = value;
    },
    CHANGE_MODIFY(state, payload) {
      state.modifyValues.values = cloneDeep(payload.values);
      state.modifyValues.index = cloneDeep(payload.index);
    },
    REWRITE_ADDEDGROUPS(state, modifyValues) {
      state.addedGroups.splice(modifyValues.index, 1, modifyValues.values);
    },
    SET_ONE_GROUP(state, values) {
      state.values = values;
    },
    ADD_GROUP_TO_REGISTER_LIST(state) {
      state.addedGroups.push(cloneDeep(state.values));
    },
    OMIT_ONE_GROUP(state, index) {
      state.addedGroups.splice(index, 1);
    },
    SET_SUBMITTING(state, value) {
      state.isSubmitting = value;
    },
    RESET_GROUPS(state) {
      state.addedGroups = [];
    },
    ADD_ARRAY_TO_GROUPS(state, array) {
      for (let i = 0; i < array.length; i++) {
        state.addedGroups.push(array[i]);
      }
    }
  },
  actions: {
    openModal({ commit }, modal) {
      commit('SWITCH_OPEN', { modal: modal, value: true });
    },
    addGroupToRegisterList({ state, commit }) {
      if (!state.formValid) {
        return;
      }
      commit('ADD_GROUP_TO_REGISTER_LIST');
      commit('INIT_VALUES');
      commit('SWITCH_OPEN', { modal: 'add', value: false });
    },
    rewriteAddedGroups({ state, commit }, modifyValues) {
      if (!state.formValid) {
        return;
      }
      commit('REWRITE_ADDEDGROUPS', modifyValues);
      commit('SWITCH_OPEN', { modal: 'modify', value: false });
    },
    async registerGroups({ state }, selectedList) {
      const reqUrl = `/list/${selectedList}/groups/bulk_register`;
      try {
        const res = await this.$axios.post(reqUrl, state.addedGroups);
        if (res.status === 200) {
          return true;
        }
      } catch (err) {
        return err.response.data;
      }
    },
    async ConfirmandRegister({ state, commit, dispatch }) {
      if (state.addedGroups.length === 0) {
        return;
      }
      if (state.selectedList === null) {
        dispatch(
          'notification/push',
          {
            text: '追加先リストを選択してください。',
            type: 'error'
          },
          { root: true }
        );
        return;
      }
      if (!window.confirm('この内容で登録しますか？')) {
        return;
      }
      commit('SET_SUBMITTING', true);

      const res = await dispatch('registerGroups', state.selectedList);
      if (res === true) {
        commit('SET_SUBMITTING', false);
        dispatch(
          'notification/push',
          {
            text: '団体の登録が完了しました。',
            type: 'success'
          },
          { root: true }
        );
        this.$router.push('/group');
      } else {
        commit('SET_SUBMITTING', false);
        dispatch(
          'notification/push',
          {
            text:
              '登録に失敗しました。\n ' +
              '#' +
              (res.index + 1) +
              'の団体の' +
              res.field +
              '「' +
              res.value +
              '」が他の団体と被っています。',
            type: 'error'
          },
          { root: true }
        );
      }
    }
  }
};

export default registerModule;
