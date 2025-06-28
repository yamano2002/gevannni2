<template>
  <v-app 
    id="inspire" 
  >
    <NavDrawer/>
    <TopToolBar/>
    <v-content>
      <v-container 
        fluid 
        fill-height>
        <v-layout id="app-wrapper">
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
    <v-footer
      class="global-footer"
      app 
      fixed>
      <span class="pl-2">&copy; GK Suite</span>
    </v-footer>
    <Notifications/>
  </v-app>
</template>

<script>
import appConfig from '../../config/app';
import { ENV } from '../../utilities/getNodeEnv';
import TopToolBar from '../components/global/top-tool-bar';
import NavDrawer from '../components/global/nav-drawer';
import Notifications from '../components/global/notifications';

export default {
  name: 'DefaultLayout',
  components: { TopToolBar, NavDrawer, Notifications },
  head() {
    return {
      title: appConfig.APP_NAME_ADMIN,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: appConfig.APP_NAME_ADMIN
        }
      ]
    };
  },
  mounted() {
    if (ENV !== 'production') {
      const elm = document.getElementById('app-wrapper');
      elm.classList.add('dev-bg');
    }
  }
};
</script>

<style>
@media screen and (max-height: 450px) {
  .global-footer {
    position: static !important;
  }
}

.dev-bg {
  background-image: url('../../assets/gevanni.jpeg');
  background-position: right bottom;
}
</style>
