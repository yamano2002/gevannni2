import list from './list';

const mailHistoryModule = {
  namespaced: true,
  state: {
    search: ''
  },
  mutations: {
    SET_SEARCH(state, search) {
      state.search = search;
    }
  },
  modules: {
    list
  }
};

export default mailHistoryModule;
