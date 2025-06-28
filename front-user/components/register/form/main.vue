<template>
  <Card :color="targetList.user_form_color">
    <template slot="title">
      <div>
        <div class="headline mb-2">{{ targetList.name }}</div>
        <v-chip 
          v-if="isAdd" 
          color="green darken-1" 
          text-color="white" 
          class="font-weight-bold" 
          disabled>新規登録</v-chip>
        <v-chip 
          v-else 
          color="orange darken-1" 
          text-color="white"
          class="font-weight-bold" 
          disabled>登録内容変更</v-chip>
      </div>
    </template>

    <Form/>

    <template slot="actions">
      <v-layout row>
        <v-flex
          xs-6
          mx-1>
          <v-btn
            block
            depressed
            color="secondary"
            @click="terminateSequence">
            キャンセル
          </v-btn>
        </v-flex>
        <v-flex
          xs-6
          mx-1>
          <v-btn
            :disabled="!form.valid"
            block
            depressed
            color="primary"
            @click="openConfirm">
            次へ
          </v-btn>
        </v-flex>
      </v-layout>
    </template>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Card from '../../common/card';
import Form from './form';

export default {
  name: 'RegisterFormMainComponent',
  components: { Card, Form },
  computed: {
    ...mapState('groupRegister', ['isAdd']),
    ...mapGetters('groupRegister', ['targetList']),
    ...mapState('groupRegister/form', ['form'])
  },
  methods: {
    ...mapActions('groupRegister', ['terminateSequence']),
    ...mapActions('groupRegister/form', ['openConfirm'])
  }
};
</script>

<style scoped>
</style>
