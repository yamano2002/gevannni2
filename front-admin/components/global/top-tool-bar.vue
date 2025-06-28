<template>
  <v-toolbar
    app
    fixed
    dark
    clipped-left>
    <v-toolbar-side-icon
      v-if="isAuthenticated"
      @click.stop="toggleGlobalNav"/>
    <v-toolbar-title><AppName /></v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-if="isAuthenticated && hasScopeMail"
        flat
        to="/create_mail"
        nuxt>
        <v-icon
          left
          small>fa-edit</v-icon>
        メール作成
      </v-btn>
      <v-btn
        v-if="isAuthenticated"
        class="login-username" 
        flat>
        <v-icon 
          left 
          small>fa-user-circle</v-icon>
        {{ username }}
      </v-btn>
      <v-btn 
        v-if="isAuthenticated" 
        flat
        to="/logout"
        nuxt>
        <v-icon 
          left 
          small>fa-sign-out-alt</v-icon>
        Log out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import AppName from '../common/app-name';
import ADMIN_SCOPE from '../../../enums/adminScopes';

export default {
  name: 'TopToolBarComponent',
  components: { AppName },
  computed: {
    ...mapState('auth', ['isAuthenticated', 'username']),
    ...mapGetters('auth', ['hasScope']),
    hasScopeMail() {
      return this.hasScope(ADMIN_SCOPE.MAIL);
    }
  },
  methods: {
    ...mapActions('createMail/editor', ['openEditor']),
    toggleGlobalNav() {
      this.$store.commit('globalNav/TOGGLE');
    }
  }
};
</script>

<style scoped>
.login-username {
  text-transform: none;
}
</style>
