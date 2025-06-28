<template>
  <v-navigation-drawer
    v-if="isAuthenticated"
    v-model="show"
    class="light-green"
    dark
    clipped
    fixed
    app
  >
    <NavDrawerList/>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import NavDrawerList from './nav-drawer-list';

export default {
  name: 'NavDrawerComponent',
  components: { NavDrawerList },
  computed: {
    ...mapState('auth', ['isAuthenticated', 'scopes']),
    show: {
      get() {
        return this.$store.state.globalNav.show;
      },
      set(value) {
        this.$store.commit('globalNav/UPDATE', value);
      }
    }
  }
};
</script>

<style scoped>
</style>
