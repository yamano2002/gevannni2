<template>
  <v-list dense>
    <v-list-tile 
      v-for="item in items" 
      v-if="hasScope(item.scopes)" 
      :to="item.href"
      :key="item.href"
      nuxt>
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.label }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex';
import GlobalDrawerItems from '../../assets/global-drawer-items';

export default {
  name: 'NavDrawerList',
  data() {
    return {
      items: GlobalDrawerItems
    };
  },
  computed: {
    ...mapGetters('auth', ['hasScope'])
  }
};
</script>

<style scoped>
</style>
