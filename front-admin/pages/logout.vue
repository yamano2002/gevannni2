<template>
  <div/>
</template>

<script>
export default {
  name: 'LogoutPage',
  fetch({ store, redirect }) {
    store.dispatch('auth/commitLogout');
    store.dispatch('notification/push', {
      text: 'ログアウトしました',
      type: 'success'
    });
  }
};
</script>

<style scoped>
</style>
