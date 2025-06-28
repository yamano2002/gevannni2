import { filterGroups } from '../../../assets/groupFilter';

const candidatesModule = {
  namespaced: true,
  state: {
    targetListId: null,
    groups: [],
    filterTxt: '',
    filterBldg: [],
    selected: [] // array of id_pub of selected Group
  },
  getters: {
    getGroupById: state => id => {
      return state.groups.find(group => group.id === id);
    },
    rmAddedGrps: (state, getters, rootState) => groups => {
      const addedGroups =
        rootState.createMail.destination.tmpDests.dests[state.targetListId];
      if (!addedGroups) {
        return groups;
      }

      return groups.filter(group =>
        addedGroups.every(item => item.id !== group.id)
      );
    },
    filteredCandGrps: (state, getters) => {
      const groups = filterGroups(
        state.groups,
        state.filterTxt,
        state.filterBldg
      );
      return getters.rmAddedGrps(groups);
    },
    getSelectedGrps: (state, getters) => {
      return getters.filteredCandGrps.filter(
        group => state.selected.indexOf(group.id) > -1
      );
    },
    countSelectedGrps: (state, getters) => {
      return getters.getSelectedGrps.length;
    }
  },
  mutations: {
    INIT(state) {
      state.targetListId = null;
      state.groups = [];
      state.filterTxt = '';
      state.filterBldg = [];
      state.selected = [];
    },
    SET_CANDIDATES(state, { targetListId, groups }) {
      state.targetListId = targetListId;
      state.groups = groups;
    },
    SET_FILTER_TXT(state, text) {
      state.filterTxt = text;
    },
    SET_FILTER_BLDG(state, bldgIds) {
      state.filterBldg = bldgIds;
    },
    SET_SELECTED(state, selected) {
      state.selected = selected;
    },
    TOGGLE_SELECT(state, groupId) {
      let idx;
      if ((idx = state.selected.indexOf(groupId)) > -1) {
        // remove
        state.selected.splice(idx, 1);
      } else {
        // add
        state.selected.push(groupId);
      }
    }
  },
  actions: {
    async retrieveGroupList({ commit }, targetListId) {
      commit('INIT');
      const reqUrl = `/list/${targetListId}/groups`;
      const res = await this.$axios.get(reqUrl);
      commit('SET_CANDIDATES', { targetListId, groups: res.data });
    },
    toggleAllSelect({ state, getters, commit }, allSelect) {
      let newSelected = [];
      if (allSelect) {
        state.groups.forEach(group => newSelected.push(group.id));
      }
      commit('SET_SELECTED', newSelected);
    },
    addGroupToTmpDests({ state, getters, dispatch }, groupId) {
      const listId = state.targetListId;
      const group = getters.getGroupById(groupId);

      dispatch(
        'createMail/destination/tmpDests/addList',
        { listId, groups: [group] },
        { root: true }
      );
    },
    addListToTmpDests({ state, getters, commit, dispatch }) {
      const listId = state.targetListId;
      if (listId === null || getters.countSelectedGrps < 1) {
        return;
      }

      const groups = getters.getSelectedGrps;
      dispatch(
        'createMail/destination/tmpDests/addList',
        { listId, groups },
        { root: true }
      );

      commit('SET_SELECTED', []);
    }
  }
};

export default candidatesModule;
