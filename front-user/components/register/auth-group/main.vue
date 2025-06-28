<template>
  <Card :color="targetList.user_form_color">
    <template slot="title">
      <div>
        <div class="headline mb-2">{{ targetList.name }}</div>
        <v-chip 
          color="blue darken-1" 
          text-color="white" 
          class="font-weight-bold" 
          disabled>団体認証</v-chip>
      </div>
    </template>

    <AuthGroupForm/>

    <template slot="actions">
      <v-layout row>
        <v-flex
          xs-6
          mx-1>
          <v-btn
            :disabled="submitting"
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
            :loading="submitting"
            block
            depressed
            color="primary"
            @click="submit">
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
import AuthGroupForm from './form';

export default {
  name: 'RegisterAuthGroupMainComponent',
  components: { Card, AuthGroupForm },
  computed: {
    ...mapState('groupRegister/authGroup', ['form', 'submitting']),
    ...mapGetters('groupRegister', ['targetList'])
  },
  methods: {
    ...mapActions('groupRegister', ['terminateSequence']),
    ...mapActions('groupRegister/authGroup', ['submit'])
  }
};
</script>

<style scoped>
</style>
