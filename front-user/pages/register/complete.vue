<template>
  <Card :color="targetList.user_form_color">
    <template slot="title">
      <div class="headline">登録完了</div>
    </template>

    <div class="my-4">
      「{{ targetList.name }}」への{{ registerType }}を受け付けました。
    </div>

    <template slot="actions">
      <v-btn
        block
        depressed
        color="secondary"
        @click="terminateSequence">
        戻る
      </v-btn>
    </template>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Card from '../../components/common/card';

export default {
  name: 'RegisterCompletePage',
  components: { Card },
  computed: {
    ...mapState('groupRegister', ['isAdd']),
    ...mapGetters('groupRegister', ['targetList']),
    registerType() {
      return this.isAdd ? '新規登録' : '登録内容変更';
    }
  },
  methods: {
    ...mapActions('groupRegister', ['terminateSequence'])
  }
};
</script>

<style scoped>
</style>
