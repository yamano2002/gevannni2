<template>
  <v-form
    v-model="valid"
    @submit.prevent="formOptions.methods.setValues">
    <v-layout class="px-3">
      以下のフォームに入力をしてください。
    </v-layout>
    <v-layout 
      v-if="error" 
      class="px-3 error--text mt-2">
      登録に失敗しました。団体名が重複していないことを確認してください。
    </v-layout>

    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.name"
            :rules="rules.name"
            label="団体名"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.name_kana"
            :rules="rules.name_kana"
            label="団体名カナ"
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
            label="担当者氏名"
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
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="values.mail"
            :rules="rules.mail"
            type="email"
            label="担当者メールアドレス"
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'GroupEditorFormComponent',
  props: {
    formOptions: { type: Object, default: null }
  },
  data() {
    return {
      rules: {
        name: [v => !!v || '必須項目です'],
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
          v => /^.+@.+$/.test(v) || 'メールアドレスの書式で入力してください'
        ]
      }
    };
  },
  computed: {
    ...mapState('buildings', ['buildings']),
    ...mapState('group/editor', ['error']),
    valid: {
      get() {
        return this.formOptions.methods.getValidMethod;
      },
      set(value) {
        this.formOptions.methods.setValidMethod(
          this.formOptions.formType,
          value
        );
      }
    },
    values: {
      get() {
        return this.formOptions.methods.getValuesMethod;
      },
      set(values) {
        this.formOptions.methods.setValidMethod(
          this.formOptions.formType,
          values
        );
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
</style>
