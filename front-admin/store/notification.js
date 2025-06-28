import Vue from 'vue';

const notificationModule = {
  namespaced: true,
  state: {
    counter: 0,
    items: {}
  },
  mutations: {
    INCREMENT_COUNTER(state) {
      state.counter++;
    },
    PUSH(state, { key, item }) {
      Vue.set(state.items, key, { key, ...item });
    },
    POP(state, key) {
      Vue.delete(state.items, key);
    }
  },
  actions: {
    push({ commit, state }, item) {
      const key = 'notification-' + state.counter;
      commit('PUSH', { key, item });
      commit('INCREMENT_COUNTER');
      setTimeout(() => {
        commit('POP', key);
      }, 8000);
    }
  }
};

export default notificationModule;
