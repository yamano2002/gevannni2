<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="openConfirm">
    <v-layout class="px-3">
      以下のフォームに入力をしてください。
    </v-layout>

    <ErrorMessage/>

    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.name"
            :rules="rules.name"
            :autofocus="isAdd"
            label="団体名"
            placeholder="駒場肉球愛好会"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.name_kana"
            :rules="rules.name_kana"
            label="団体名カナ"
            placeholder="コマバニクキュウアイコウカイ"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-select
            v-model="values.BuildingId"
            :items="buildings"
            item-text="name"
            item-value="id"
            label="部室のある建物"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.charge_person_name"
            :rules="rules.charge_person_name"
            :autofocus="!isAdd"
            label="担当者氏名"
            placeholder="駒場ユキ"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.tel"
            :rules="rules.tel"
            type="tel"
            label="担当者電話番号"
            placeholder="09012345678"
          />
        </v-flex>
      </v-layout>
      <v-layout 
        row 
        wrap>
        <v-flex grow>
          <v-text-field
            v-model="values.mail"
            :rules="rules.mail"
            type="email"
            label="担当者メールアドレス"
            placeholder="yuki@komaba.com"
            @input="values.mail_auth_code=''"
          />
        </v-flex>
        <v-flex 
          shrink 
          class="pa-0 align-self-center">
          <v-btn 
            :disabled="!mailValid"
            :loading="authCode.sending"
            small
            depressed
            color="primary"
            class="ma-1"
            @click="sendAuthCode">認証コード送信</v-btn>
        </v-flex>
        <v-flex 
          column 
          fill-height>
          <v-sheet 
            class="pa-2" 
            color="#E9E0F5">
            以下のドメインのアドレスにはメールが届かない可能性が高いです。お手数ですが、Gmail や 東京大学発行の ECCS メールなど、別のサービスのメールアドレスを入力してください。<br>
            <ul>
              <li>hotmail.co.jp</li>
              <li>outlook.jp</li>
              <li>live.jp</li>
            </ul>
          </v-sheet>
        </v-flex>
      </v-layout>
      <v-expand-transition>
        <v-layout 
          v-show="showAuthCodeForm" 
          row 
          wrap>
          <v-flex xs12>
            <v-flex xs12>
              <b><i>{{ authCode.sentTo }}</i></b> に送信された認証コードを入力してください。
            </v-flex>
            <v-text-field
              v-model="values.mail_auth_code"
              :rules="rules.mail_auth_code"
              type="number"
              label="認証コード"
              placeholder="0123"
            />
            <v-flex xs12>
              認証コードが届かない場合、入力されたメールアドレスが正しいか、またはメールが迷惑メールに振り分けられていないか確認してください。
            </v-flex>
          </v-flex>
        </v-layout>
      </v-expand-transition>
    </v-container>
    <!-- This invisible submit button is necessary to submit with enter key -->
    <v-btn
      type="submit"
      class="d-none">submit</v-btn>
  </v-form>
</template>

<script>
import appConfig from '../../../../config/app';
import REGISTER_GROUP_ERROR from '../../../../enums/errors/registerGroup';
import { mapState, mapActions } from 'vuex';
import ErrorMessage from './form-error-message';

const AUTH_CODE_LEN = appConfig.USER_MAIL_AUTH_CODE_LENGTH;

export default {
  name: 'RegisterFormFormComponent',
  components: { ErrorMessage },
  data() {
    return {
      rules: {
        name: [
          v => !!v || '必須項目です',
          v =>
            this.ruleOnSubmitError(
              REGISTER_GROUP_ERROR.GROUP_NAME_DUPLICATED,
              () => {
                const dupName = this.submitError.groupName;
                return (
                  v !== dupName || `団体名「${dupName}」は既に使われています`
                );
              }
            )
        ],
        name_kana: [
          v => !!v || '必須項目です',
          v => /^[ァ-ー]+$/.test(v) || '全角カタカナのみで入力してください'
        ],
        charge_person_name: [v => !!v || '必須項目です'],
        tel: [
          v => !!v || '必須項目です',
          v => /^[0-9]+$/.test(v) || '半角数字のみで入力してください'
        ],
        mail: [
          v => !!v || '必須項目です',
          v => /^.+@.+$/.test(v) || 'メールアドレスの書式で入力してください',
          v =>
            this.ruleOnSubmitError(REGISTER_GROUP_ERROR.MAIL_DUPLICATED, () => {
              return (
                v !== this.submitError.mail ||
                'そのメールアドレスは既に使われています'
              );
            })
        ],
        mail_auth_code: [
          v => !!v || '必須項目です',
          v =>
            (/^[0-9]+$/.test(v) && v.length === AUTH_CODE_LEN) ||
            `半角数字${AUTH_CODE_LEN}文字で入力してください`,
          v =>
            this.ruleOnSubmitError(
              REGISTER_GROUP_ERROR.MISMATCH_AUTH_CODE,
              () => {
                return (
                  v !== this.submitError.authCode || '認証コードが違います'
                );
              }
            )
        ]
      }
    };
  },
  computed: {
    ...mapState('buildings', ['buildings']),
    ...mapState('groupRegister', ['isAdd']),
    ...mapState('groupRegister/form', ['authCode', 'submitError']),
    valid: {
      get() {
        return this.$store.state.groupRegister.form.form.valid;
      },
      set(value) {
        this.$store.commit('groupRegister/form/UPDATE_FORM_VALID', value);
      }
    },
    values: {
      get() {
        return this.$store.state.groupRegister.form.form.values;
      },
      set(value) {
        this.$store.commit('groupRegister/form/UPDATE_FORM_VALUES', value);
      }
    },
    mailValid() {
      return this.rules.mail.every(cb => {
        return cb(this.values.mail) === true;
      });
    },
    showAuthCodeForm() {
      return this.authCode.sentTo === this.values.mail;
    }
  },
  watch: {
    submitError(newVal, oldVal) {
      this.$refs.form.validate();
    }
  },
  methods: {
    ...mapActions('groupRegister/form', ['sendAuthCode', 'openConfirm']),
    ruleOnSubmitError(errorType, rule) {
      if (!this.submitError || this.submitError.type !== errorType) {
        return true;
      }

      return rule();
    }
  }
};
</script>

<style scoped>
</style>
