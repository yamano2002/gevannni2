import authGroupModule from './authGroup';
import formModule from './form';

import PHASE from '../../assets/group-register/phase';
import PHASE_PAGE from '../../assets/group-register/phase-pahe-path';

const groupRegisterModule = {
  namespaced: true,
  state: {
    phase: PHASE.STAND_BY,
    isAdd: true,
    targetListTag: null,
    modifyToken: null,
    groupIdPub: null
  },
  getters: {
    targetList(state, getters, rootState) {
      return rootState.lists.lists[state.targetListTag];
    }
  },
  mutations: {
    INIT(state, { targetListTag, phase, isAdd }) {
      state.targetListTag = targetListTag;
      state.phase = phase;
      state.isAdd = isAdd;
      state.modifyToken = null;
      state.groupIdPub = null;
    },
    SET_PHASE(state, phase) {
      state.phase = phase;
    },
    SET_MODIFY_TOKEN(state, modifyToken) {
      state.modifyToken = modifyToken;
    },
    SET_GROUP_ID_PUB(state, idPub) {
      state.groupIdPub = idPub;
    }
  },
  actions: {
    initSequence({ rootState, commit }, { listTag, isAdd }) {
      const firstPhase = isAdd ? PHASE.FORM : PHASE.AUTH_GROUP;
      commit('INIT', {
        targetListTag: listTag,
        phase: firstPhase,
        isAdd: isAdd
      });
      commit('authGroup/INIT');
      commit('form/INIT');
      this.$router.push(PHASE_PAGE[firstPhase]);
    },
    AuthGroup2Form({ commit }, { modify_token, idPub, group_info }) {
      commit('SET_MODIFY_TOKEN', modify_token);
      commit('SET_GROUP_ID_PUB', idPub);
      commit('form/INIT', group_info);
      commit('SET_PHASE', PHASE.FORM);
      this.$router.push(PHASE_PAGE[PHASE.FORM]);
    },
    Form2Complete({ commit }) {
      commit('SET_PHASE', PHASE.COMPLETE);
      this.$router.push(PHASE_PAGE[PHASE.COMPLETE]);
    },
    terminateSequence({ commit }) {
      commit('SET_PHASE', PHASE.STAND_BY);
      this.$router.push('/');
    }
  },
  modules: {
    authGroup: authGroupModule,
    form: formModule
  }
};

export default groupRegisterModule;
