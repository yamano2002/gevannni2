const pkg = require('../package');
const env = require('../utilities/getNodeEnv').ENV;
const httpConfig = require('./http')[env];

const httpPrtc = env === 'production' || env === 'staging' ? 'https' : 'http';

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#4286f4' },

  /*
  ** Global CSS
  */
  css: ['@fortawesome/fontawesome-free/css/all.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources',
    'nuxt-client-init-module',
    ['@nuxtjs/moment', ['ja']]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: `${httpPrtc}://` + httpConfig.frontend.backendFqdn
  },

  vuetify: {
    iconfont: 'fa'
  },

  styleResources: {
    stylus: '../node_modules/vuetify/src/stylus/main.styl'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common';
      // // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   });
      // }
    }
  }
};
