<template>
  <v-toolbar
    app
    fixed
    dark
    clipped-left>
    <v-toolbar-title><AppName /></v-toolbar-title>
  </v-toolbar>
</template>

<script>
import AppName from '../common/app-name';

export default {
  name: 'TopToolBarComponent',
  components: { AppName }
};
</script>

<style scoped>
.login-username {
  text-transform: none;
}
</style>
