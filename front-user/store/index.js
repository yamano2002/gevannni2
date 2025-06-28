import Vuex from 'vuex';
import authModule from './auth';
import listsModule from './lists';
import groupRegisterModule from './groupRegister';
import buildingsModule from './buildings';

const store = () =>
  new Vuex.Store({
    state: {
      initialized: false
    },
    mutations: {
      INIT(state) {
        state.initialized = true;
      }
    },
    actions: {
      async nuxtClientInit({ dispatch, commit }) {
        dispatch('initAxios');
        await dispatch('auth/init');
        commit('INIT');
      },
      initAxios({ dispatch, commit, state }) {
        this.$axios.onResponseError(error => {
          if (state.auth.isAuthenticated && error.response.status === 401) {
            dispatch('auth/commitLogout');
            commit('auth/SESSION_EXPIRED');
          }
        });
      }
    },
    modules: {
      auth: authModule,
      lists: listsModule,
      groupRegister: groupRegisterModule,
      buildings: buildingsModule
    }
  });

export default store;
