const groupListModule = {
  namespaced: true,
  state: {
    targetListId: null,
    groups: []
  },
  getters: {
    targetList(state, getters, rootState, rootGetters) {
      return rootGetters['lists/findListById'](state.targetListId);
    },
    findGroupById: state => groupId => {
      return state.groups.find(group => group.id === groupId);
    }
  },
  mutations: {
    INIT(state) {
      state.targetListId = null;
      state.groups = [];
    },
    SET_LIST_ID_AND_GROUPS(state, { targetListId, groups }) {
      state.targetListId = targetListId;
      state.groups = groups;
    }
  },
  actions: {
    async retrieveGroupList({ commit }, targetListId) {
      const reqUrl = `/list/${targetListId}/groups`;
      const res = await this.$axios.get(reqUrl);
      commit('SET_LIST_ID_AND_GROUPS', { targetListId, groups: res.data });
    },
    async reloadGroupList({ state, dispatch }) {
      await dispatch('retrieveGroupList', state.targetListId);
    }
  }
};

export default groupListModule;
