import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import candidates from './candidates';
import tmpDests from './tmpDests';

const destinationsModule = {
  namespaced: true,
  state: {
    modalOpen: false,
    dests: {}
  },
  getters: {
    isDestsEmpty: state => {
      return isEmpty(state.dests);
    }
  },
  mutations: {
    SWITCH_MODAL_OPEN(state, value) {
      state.modalOpen = value;
    },
    SET_DESTS(state, dests) {
      state.dests = cloneDeep(dests);
    }
  },
  actions: {
    openSelectModal({ commit, dispatch }) {
      commit('candidates/INIT');
      dispatch('tmpDests/init');
      commit('SWITCH_MODAL_OPEN', true);
    }
  },
  modules: {
    candidates,
    tmpDests
  }
};

export default destinationsModule;
