import cloneDeep from 'lodash/cloneDeep';
import forOwn from 'lodash/forOwn';
import castArray from 'lodash/castArray';
import remove from 'lodash/remove';

const tmpDestsModule = {
  namespaced: true,
  state: {
    dests: {},
    selected: [],
    listExpanded: {}
  },
  getters: {
    getListIds: state => {
      return Object.keys(state.dests);
    },
    getDestItemKey: () => group => {
      return `${group.ListId}-${group.id}`;
    },
    parseDestItemKey: () => key => {
      // [ listId, groupId ]
      return key.split('-');
    },
    parseSelectedDestItemKey: (state, getters) => {
      let rtnObj = {};
      state.selected.forEach(key => {
        let [listId, groupId] = getters.parseDestItemKey(key);
        groupId = Number(groupId);
        if (!rtnObj[listId]) {
          rtnObj[listId] = [groupId];
        } else {
          rtnObj[listId].push(groupId);
        }
      });

      /*
        {
          listId1: [ groupId1, groupId2, ... groupIdN ],
          listId2: [ groupId(N+1), groupId(N+2), ... groupId(N+M) ],
          ...
        }
       */
      return rtnObj;
    },
    isListExpanded: state => listId => {
      return state.listExpanded[listId];
    },
    isGroupSelected: (state, getters) => group => {
      const grpKey = getters.getDestItemKey(group);
      return state.selected.indexOf(grpKey) > -1;
    },
    isListHasSelectedGrp: (state, getters) => listId => {
      return state.dests[listId].some(group => getters.isGroupSelected(group));
    },
    isListAllGrpSelected: (state, getters) => listId => {
      return state.dests[listId].every(group => getters.isGroupSelected(group));
    },
    existSelected: (state, getters) => {
      return getters.getListIds.some(listId => {
        return (
          (getters.isListExpanded(listId) &&
            getters.isListHasSelectedGrp(listId)) ||
          getters.isListAllGrpSelected(listId)
        );
      });
    },
    countTotalDests: state => {
      let count = 0;
      forOwn(state.dests, groups => {
        count += groups.length;
      });
      return count;
    }
  },
  mutations: {
    SET_DESTS_TMP(state, dests) {
      state.dests = cloneDeep(dests);
    },
    SET_DESTS_WITH_LIST_ID(state, { listId, groups }) {
      state.dests = { ...state.dests, [listId]: groups };
    },
    DELETE_LIST(state, listId) {
      let tmpDests = cloneDeep(state.dests);
      delete tmpDests[listId];
      state.dests = tmpDests;
    },
    SET_SELECTED(state, selected) {
      state.selected = selected;
    },
    TOGGLE_SELECT(state, target) {
      let idx;
      if ((idx = state.selected.indexOf(target)) > -1) {
        // remove
        state.selected.splice(idx, 1);
      } else {
        // add
        state.selected.push(target);
      }
    },
    SET_LIST_EXPANDED(state, value) {
      state.listExpanded = value;
    }
  },
  actions: {
    init({ rootState, commit }) {
      commit('SET_SELECTED', []);
      commit('SET_DESTS_TMP', rootState.createMail.destination.dests);
    },
    addList({ state, commit }, { listId, groups }) {
      let newGroups = state.dests[listId] || [];
      newGroups = newGroups.concat(cloneDeep(groups));
      commit('SET_DESTS_WITH_LIST_ID', { listId, groups: newGroups });
      commit('SET_LIST_EXPANDED', { ...state.listExpanded, [listId]: true });
    },
    rmDestsByListAndGrpId({ state, commit }, { listId, groupIds }) {
      groupIds = castArray(groupIds);
      let groups = state.dests[listId];
      remove(groups, group => groupIds.indexOf(group.id) > -1);

      if (groups.length > 0) {
        commit('SET_DESTS_WITH_LIST_ID', { listId, groups });
      } else {
        commit('DELETE_LIST', listId);
      }
    },
    removeSelectedDests({ state, getters, commit, dispatch }) {
      const parsedKeys = getters.parseSelectedDestItemKey;
      forOwn(parsedKeys, (groupIds, listId) => {
        if (
          !getters.isListExpanded(listId) &&
          !getters.isListAllGrpSelected(listId)
        ) {
          return;
        }
        dispatch('rmDestsByListAndGrpId', { listId, groupIds });
      });

      commit('SET_SELECTED', []);
    },
    toggleListAllSelect({ state, getters, commit }, { listId, value }) {
      const groups = state.dests[listId];
      groups.forEach(group => {
        if (
          (value === true && !getters.isGroupSelected(group)) ||
          (value === false && getters.isGroupSelected(group))
        ) {
          commit('TOGGLE_SELECT', getters.getDestItemKey(group));
        }
      });
    },
    save({ state, commit }) {
      commit('createMail/destination/SET_DESTS', state.dests, { root: true });
    },
    clear({ commit }) {
      commit('SET_DESTS_TMP', {});
    }
  }
};

export default tmpDestsModule;
