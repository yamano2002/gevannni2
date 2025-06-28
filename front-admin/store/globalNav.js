const globalNavModule = {
  namespaced: true,
  state: {
    show: null
  },
  mutations: {
    TOGGLE(state) {
      state.show = !state.show;
    },
    UPDATE(state, val) {
      state.show = val;
    }
  }
};

export default globalNavModule;
