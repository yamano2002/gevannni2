import Vuex from 'vuex';
import authModule from './auth';
import globalNavModule from './globalNav';
import listsModule from './lists';
import groupModule from './group/';
import createMailModule from './createMail/';
import mailHistoryModule from './mailHistory/';
import notificationModule from './notification';
import settingsModule from './settings/';
import sendMailSettingModule from './sendMailSetting';
import mailTemplateModule from './mailTemplate';
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
      initAxios({ dispatch, state }) {
        this.$axios.onResponseError(error => {
          if (state.auth.isAuthenticated && error.response.status === 401) {
            dispatch('auth/commitLogout');
            dispatch('notification/push', {
              text: 'セッション切れのためログアウトしました',
              type: 'error'
            });
          }
        });
      }
    },
    modules: {
      auth: authModule,
      globalNav: globalNavModule,
      lists: listsModule,
      group: groupModule,
      createMail: createMailModule,
      mailHistory: mailHistoryModule,
      notification: notificationModule,
      settings: settingsModule,
      sendMailSetting: sendMailSettingModule,
      mailTemplate: mailTemplateModule,
      buildings: buildingsModule
    }
  });

export default store;
