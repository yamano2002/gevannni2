import cloneDeep from 'lodash/cloneDeep';

const listsModule = {
  namespaced: true,
  state: {
    lists: [],
    listEditor: {
      isOpen: false,
      isAdd: true,
      isSaving: false,
      formValid: true,
      input: {},
      defaultInput: {
        name: '',
        tag: '',
        group_id_prefix: '',
        user_form_enabled: false,
        user_form_color: 'rgb(255,224,255)'
      }
    },
    deleteConfirm: {
      isOpen: false,
      targetId: null,
      isDeleting: false
    }
  },
  getters: {
    findListById: state => listId => {
      return state.lists.find(list => list.id === listId);
    },
    findLastCreatedList: state => {
      if (state.lists.length < 0) {
        return null;
      }

      const _lists = cloneDeep(state.lists);
      _lists.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) {
          return 0;
        }
        if (!a.createdAt) {
          return 1;
        }
        if (!b.createdAt) {
          return -1;
        }
        return a.createdAt < b.createdAt ? 1 : -1;
      });

      return _lists[0];
    },
    editorFormNameDuplicated: state => field => {
      const formList = state.listEditor.input;
      return state.lists.some(
        list => list[field] === formList[field] && list.id !== formList.id
      );
    },
    deleteTargetListName: state => {
      const listId = state.deleteConfirm.targetId;
      const targetList = state.lists.find(list => list.id === listId);
      return targetList ? targetList.name : '';
    }
  },
  mutations: {
    SET_LISTS(state, newLists) {
      state.lists = newLists;
    },
    OPEN_EDITOR(state, isAdd) {
      state.listEditor.isAdd = isAdd;
      state.listEditor.isOpen = true;
      state.listEditor.isSaving = false;
    },
    CLOSE_EDITOR(state) {
      state.listEditor.isOpen = false;
      state.listEditor.isSaving = false;
    },
    SET_EDITOR_FORM_VALUE(state, values) {
      state.listEditor.input = JSON.parse(JSON.stringify(values));
    },
    UPDATE_FORM_VALID(state, value) {
      state.listEditor.formValid = value;
    },
    SAVING(state) {
      state.listEditor.isSaving = true;
    },
    OPEN_DELETE_CONF(state, targetListId) {
      state.deleteConfirm.isOpen = true;
      state.deleteConfirm.targetId = targetListId;
      state.deleteConfirm.isDeleting = false;
    },
    CLOSE_DELETE_CONF(state) {
      state.deleteConfirm.isOpen = false;
      state.deleteConfirm.isDeleting = false;
    },
    DELETING(state) {
      state.deleteConfirm.isDeleting = true;
    }
  },
  actions: {
    async getLists({ commit }) {
      const newLists = await this.$axios.get('/list/list');
      commit('SET_LISTS', newLists.data);
    },
    openAddEditor({ commit, state }) {
      commit('SET_EDITOR_FORM_VALUE', state.listEditor.defaultInput);
      commit('OPEN_EDITOR', true);
    },
    openModifyEditor({ commit, state }, targetId) {
      const targetList = state.lists.find(list => list.id === targetId);
      commit('SET_EDITOR_FORM_VALUE', targetList);
      commit('OPEN_EDITOR', false);
    },
    async saveList({ commit, state, dispatch }) {
      if (state.listEditor.formValid) {
        commit('SAVING');
        await this.$axios.put('/list/save', state.listEditor.input);
        await dispatch('getLists');

        commit('CLOSE_EDITOR');
        dispatch(
          'notification/push',
          {
            text: `リスト「${state.listEditor.input.name}」を登録しました`,
            type: 'success'
          },
          {
            root: true
          }
        );
      }
    },
    async deleteList({ commit, state, getters, dispatch }) {
      const deletedListName = getters.deleteTargetListName;
      commit('DELETING');
      await this.$axios.delete(`/list/${state.deleteConfirm.targetId}`);
      await dispatch('getLists');

      commit('CLOSE_DELETE_CONF');
      dispatch(
        'notification/push',
        {
          text: `リスト「${deletedListName}」を登録しました`,
          type: 'success'
        },
        {
          root: true
        }
      );
    },
    async toggleFormEnabled({ getters, dispatch }, listId) {
      const targetList = getters.findListById(listId);
      const isEnable = !targetList.user_form_enabled;
      const conf = confirm(
        `リスト「${targetList.name}」のフォームを ${
          isEnable ? '有効' : '無効'
        } にしますか？`
      );
      if (!conf) {
        return;
      }

      const reqUrl =
        `/list/${listId}/user_form/` + (isEnable ? 'enable' : 'disable');
      await this.$axios.patch(reqUrl);
      await dispatch('getLists');

      dispatch(
        'notification/push',
        {
          text: `リスト「${targetList.name}」のフォームを ${
            isEnable ? '有効' : '無効'
          } にしました`,
          type: 'success'
        },
        {
          root: true
        }
      );
    }
  }
};

export default listsModule;
