<template>
  <v-layout>
    <RegisterFormMain/>
    <AuthCodeSentNotification/>
    <ConfirmModal/>
  </v-layout>
</template>

<script>
import RegisterFormMain from '../../components/register/form/main';
import AuthCodeSentNotification from '../../components/register/form/auth-code-sent-notification';
import ConfirmModal from '../../components/register/form/confirm-modal';

export default {
  name: 'RegisterFormPage',
  components: { RegisterFormMain, AuthCodeSentNotification, ConfirmModal },
  async fetch({ store }) {
    await store.dispatch('buildings/getBuildings');
  }
};
</script>

<style scoped>
</style>
