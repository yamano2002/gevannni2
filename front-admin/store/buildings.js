const buildingsModule = {
  namespaced: true,
  state: {
    buildings: []
  },
  getters: {
    getBuildingById: state => id => {
      return state.buildings.find(building => building.id === id);
    }
  },
  mutations: {
    SET_BUILDINGS(state, newBuildings) {
      state.buildings = newBuildings;
      state.buildings.unshift({
        id: null,
        name: 'なし'
      });
    }
  },
  actions: {
    async getBuildings({ state, commit }) {
      // data already set
      if (state.buildings.length > 0) {
        return;
      }

      const res = await this.$axios.get('/building');
      commit('SET_BUILDINGS', res.data);
    }
  }
};

export default buildingsModule;
