const ACCESS_TOKEN_STORAGE_KEY = 'admin_access_token';

const authModule = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    access_token: null,
    username: null,
    scopes: []
  },
  getters: {
    hasScope: state => requiredScopes => {
      if (!requiredScopes) {
        return true;
      }

      if (!Array.isArray(requiredScopes)) {
        requiredScopes = [requiredScopes];
      }
      return state.scopes.some(scope => requiredScopes.indexOf(scope) > -1);
    }
  },
  mutations: {
    LOGIN(state, { access_token, username, scopes }) {
      state.isAuthenticated = true;
      state.access_token = access_token;
      state.username = username;
      state.scopes = scopes;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.access_token = null;
      state.username = null;
      state.scopes = [];
    }
  },
  actions: {
    async init({ dispatch }) {
      // retrieve access token from localStorage of client browser
      const access_token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

      // access token does not exist
      if (access_token === null) {
        return;
      }

      let userData;
      try {
        userData = await dispatch('checkAccessToken', {
          access_token: access_token
        });
      } catch (e) {
        // access token is invalid
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        return;
      }
      dispatch('commitLogin', { access_token, ...userData });
    },
    async checkAccessToken({ state, dispatch }, { access_token }) {
      /**
       * data = {
       *  username: String,
       *  scopes: Array
       * }
       */

      // throw exception if the check is failed
      const { data } = await this.$axios.post('/access_token/check', {
        access_token: access_token || state.access_token
      });
      return data;
    },
    async requestAccessToken({ dispatch }, { username, password }) {
      /**
       * data = {
       *  username: String,
       *  access_token: String,
       *  scopes: Array
       * }
       */
      const { data } = await this.$axios.post('/access_token/issue', {
        username: username,
        password: password
      });
      dispatch('commitLogin', data);
    },
    commitLogin({ commit, dispatch }, { username, scopes, access_token }) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
      this.$axios.setToken(access_token, 'Bearer');
      commit('LOGIN', { access_token, username, scopes });
    },
    commitLogout({ commit }) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      this.$axios.setToken(false);
      commit('LOGOUT');
      this.$router.push('/login');
    },
    scopeFilter({ getters }, requiredScopes) {
      if (!getters.hasScope(requiredScopes)) {
        throw {
          statusCode: 403,
          message: 'Forbidden request for your scopes.'
        };
      }
    }
  }
};

export default authModule;
