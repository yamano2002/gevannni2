import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';

const editorModule = {
  namespaced: true,
  state: {
    modalOpen: false,
    values: {},
    formValid: false,
    saving: false,
    error: false
  },
  mutations: {
    EDITOR_SWITCH_OPEN(state, value) {
      state.modalOpen = value;
    },
    SET_FORM_VALUES(state, values) {
      state.values = values;
    },
    SET_FORM_VALID(state, value) {
      state.formValid = value;
    },
    SET_SAVING(state, value) {
      state.saving = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    }
  },
  actions: {
    openEditor({ commit, rootGetters }, groupId) {
      const targetGroup = cloneDeep(
        rootGetters['group/groupList/findGroupById'](groupId)
      );
      commit(
        'SET_FORM_VALUES',
        pick(targetGroup, [
          'ListId',
          'id_pub',
          'name',
          'name_kana',
          'BuildingId',
          'charge_person_name',
          'tel',
          'mail'
        ])
      );
      commit('SET_ERROR', false);
      commit('EDITOR_SWITCH_OPEN', true);
    },
    async save({ state, commit, dispatch }) {
      if (!state.formValid) {
        return;
      }

      const conf = confirm('編集内容を保存しますか？');
      if (!conf) {
        return;
      }

      commit('SET_SAVING', true);
      await this.$axios
        .put('/group/modify', state.values)
        .then(async res => {
          await dispatch('group/groupList/reloadGroupList', {}, { root: true });
          commit('EDITOR_SWITCH_OPEN', false);
          dispatch(
            'notification/push',
            {
              text: `団体「${state.values.name}」を登録しました`,
              type: 'success'
            },
            {
              root: true
            }
          );
        })
        .catch(e => {
          commit('SET_ERROR', true);
        })
        .finally(() => {
          commit('SET_SAVING', false);
        });
    }
  }
};

export default editorModule;
