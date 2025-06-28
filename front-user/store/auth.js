const ACCESS_TOKEN_STORAGE_KEY = 'user_access_token';

const authModule = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    access_token: null,
    username: null,
    authFailed: false,
    sessionExpired: false
  },
  mutations: {
    LOGIN(state, { access_token, username }) {
      state.isAuthenticated = true;
      state.access_token = access_token;
      state.username = username;
      state.authFailed = false;
      state.sessionExpired = false;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.access_token = null;
      state.username = null;
    },
    AUTH_FAILED(state) {
      state.authFailed = true;
    },
    SESSION_EXPIRED(state) {
      state.sessionExpired = true;
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
       * }
       */
      const { data } = await this.$axios.post('/access_token/issue', {
        username: username,
        password: password
      });
      dispatch('commitLogin', data);
    },
    commitLogin({ commit, dispatch }, { username, access_token }) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
      this.$axios.setToken(access_token, 'Bearer');
      commit('LOGIN', { access_token, username });
    },
    commitLogout({ commit }) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      this.$axios.setToken(false);
      commit('LOGOUT');
      this.$router.push('/login');
    }
  }
};

export default authModule;
