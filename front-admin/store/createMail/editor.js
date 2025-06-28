import pick from 'lodash/pick';
import forOwn from 'lodash/forOwn';
import MAIL_TMP from '../../../enums/mailTmpTag';

const editorModule = {
  namespaced: true,
  state: {
    modalOpen: false,
    input: {},
    variables: {},
    isSending: false
  },
  getters: {
    prcDestsForSend: (state, getters, rootState) => {
      const dests = rootState.createMail.destination.dests;

      let rtnVal = [];
      forOwn(dests, (groups, listId) => {
        let tmpList = {
          ListId: Number(listId),
          groupIdPub: []
        };
        groups.forEach(group => {
          tmpList.groupIdPub.push(group.id_pub);
        });
        rtnVal.push(tmpList);
      });

      /*
        return format:
        [
          {
            ListId: 1,
            groupIdPub: [ 1, 2, 3 ]
          },
          {
            ListId: 2,
            groupIdPub: [ 1, 2, 3 ]
          }
        ]
       */
      return rtnVal;
    }
  },
  mutations: {
    SWITCH_OPEN(state, value) {
      state.modalOpen = value;
    },
    SET_INPUT(state, newInput) {
      state.input = newInput;
    },
    SET_VARIABLES(state, variables) {
      state.variables = variables;
    },
    SET_SENDING(state, value) {
      state.isSending = value;
    }
  },
  actions: {
    initEditor({ commit, rootGetters }) {
      const template = rootGetters['mailTemplate/findTemplateByTag'](
        MAIL_TMP.MAILING_LIST_TMP
      );
      const input = pick(template, [
        'from_address_name',
        'from_address_local_part',
        'reply_to',
        'subject',
        'body'
      ]);

      if (template.has_sign) {
        const footerSign = rootGetters['sendMailSetting/footerSign'];
        input.body += '\n\n\n' + footerSign;
      }

      commit('SET_INPUT', input);
      commit('SET_VARIABLES', template.variables);
      commit('SET_SENDING', false);
      commit('createMail/destination/SET_DESTS', {}, { root: true });
    },
    openEditor({ commit, dispatch }) {
      dispatch('initEditor');
      commit('SWITCH_OPEN', true);
    },
    async send({ state, getters, commit, dispatch }) {
      const input = state.input;
      if (!input.subject) {
        alert('「件名」を入力してください。');
        return;
      }
      if (!input.body) {
        alert('「本文」を入力してください。');
        return;
      }

      const destinations = getters.prcDestsForSend;
      if (destinations.length < 1) {
        alert('配信先が選択されていません。');
        return;
      }

      const conf = confirm('送信してよろしいですか？');
      if (!conf) {
        return;
      }

      const reqBody = { ...input, destinations };
      commit('SET_SENDING', true);

      try {
        await this.$axios.post('/mail/send', reqBody);
      } catch (e) {
        dispatch(
          'notification/push',
          {
            text: `メールの送信に失敗しました。[ ${e.message} ]`,
            type: 'error'
          },
          {
            root: true
          }
        );
        return;
      } finally {
        commit('SET_SENDING', false);
      }

      dispatch(
        'notification/push',
        {
          text: 'メールを送信しました。',
          type: 'success'
        },
        {
          root: true
        }
      );

      // close editor
      commit('SWITCH_OPEN', false);
    }
  }
};

export default editorModule;
