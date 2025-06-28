const listsModule = {
  namespaced: true,
  state: {
    lists: {}
  },
  mutations: {
    SET_LISTS(state, newLists) {
      state.lists = newLists;
    }
  },
  actions: {
    async getLists({ commit }) {
      const res = await this.$axios.get('/list');
      const newLists = res.data.reduce((lists, currentList) => {
        lists[currentList.tag] = currentList;
        return lists;
      }, {});
      commit('SET_LISTS', newLists);
    }
  }
};

export default listsModule;
