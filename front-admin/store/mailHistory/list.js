const listModule = {
  namespaced: true,
  state: {
    sentMails: [],
    totalCount: 0,
    pagination: {
      sortBy: 'sentAt',
      descending: true
    },
    searchQuery: '',
    loading: false
  },
  mutations: {
    SET_SENT_MAILS(state, sentMails) {
      state.sentMails = sentMails;
    },
    SET_TOTAL_COUNT(state, totalCount) {
      state.totalCount = totalCount;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    SET_SEARCH_QUERY(state, searchQuery) {
      state.searchQuery = searchQuery;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    }
  },
  actions: {
    async getSentMailList({ state, rootState, commit }) {
      const search = rootState.mailHistory.search;
      const reqQuery = {
        ...state.pagination,
        search
      };

      commit('SET_LOADING', true);

      const res = await this.$axios.get('/mail_history', { params: reqQuery });

      commit('SET_LOADING', false);

      const { total, items } = res.data;

      commit('SET_SEARCH_QUERY', search);
      commit('SET_SENT_MAILS', items);
      commit('SET_TOTAL_COUNT', total);
    }
  }
};

export default listModule;
