<template>
  <v-form 
    v-model="valid" 
    @submit.prevent="submit">
    <v-layout class="px-3">
      団体ID と 現担当者のメールアドレス を入力してください。
    </v-layout>
    <v-layout 
      v-if="authFailed" 
      class="px-3 mt-3 error--text">
      団体ID または 担当者メールアドレス が違います。
    </v-layout>
    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            :prefix="targetList.group_id_prefix + '-'"
            :rules="rules.groupId"
            v-model="values.id_pub"
            label="団体ID"
            type="number"
            placeholder="0123"
            autofocus
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            :rules="rules.mail"
            v-model="values.mail"
            label="担当者メールアドレス"
            type="email"
            placeholder="exmaple@example.com"
          />
        </v-flex>
      </v-layout>
    </v-container>
    <!-- This invisible submit button is necessary to submit with enter key -->
    <v-btn 
      type="submit" 
      class="d-none">submit</v-btn>
  </v-form>
</template>

<script>
import appConfig from '../../../../config/app';
import { mapState, mapGetters, mapActions } from 'vuex';

const ID_LEN = appConfig.GROUP_ID_PUB_DIGIT_NUM;

export default {
  name: 'RegisterAuthGroupFromComponent',
  data() {
    return {
      rules: {
        groupId: [
          v => !!v || '必須項目です',
          v =>
            (/^[0-9]+$/.test(v) && v.length === ID_LEN) ||
            `半角数字${ID_LEN}文字で入力してください`
        ],
        mail: [
          v => !!v || '必須項目です',
          v => /.+@.+/.test(v) || 'メールアドレスの書式で入力してください'
        ]
      }
    };
  },
  computed: {
    ...mapState('groupRegister/authGroup', ['authFailed']),
    ...mapGetters('groupRegister', ['targetList']),
    valid: {
      get() {
        return this.$store.state.groupRegister.authGroup.form.valid;
      },
      set(value) {
        this.$store.commit('groupRegister/authGroup/UPDATE_FORM_VALID', value);
      }
    },
    values: {
      get() {
        return this.$store.state.groupRegister.authGroup.form.values;
      },
      set(value) {
        this.$store.commit('groupRegister/authGroup/UPDATE_FORM_VALUES', value);
      }
    }
  },
  methods: {
    ...mapActions('groupRegister/authGroup', ['submit'])
  }
};
</script>

<style scoped>
</style>
