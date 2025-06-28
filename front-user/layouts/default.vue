<template>
  <v-app
    id="inspire"
  >
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
  </v-app>
</template>

<script>
import appConfig from '../../config/app';
import { ENV } from '../../utilities/getNodeEnv';
import TopToolBar from '../components/global/top-tool-bar';

export default {
  name: 'DefaultLayout',
  components: { TopToolBar },
  head() {
    return {
      title: appConfig.APP_NAME_USER,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: appConfig.APP_NAME_USER
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
