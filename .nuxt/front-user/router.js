import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _6da9ddda = () => interopDefault(import('../../front-user/pages/login.vue' /* webpackChunkName: "pages/login" */))
const _36240137 = () => interopDefault(import('../../front-user/pages/register/auth-group.vue' /* webpackChunkName: "pages/register/auth-group" */))
const _28fdc3d4 = () => interopDefault(import('../../front-user/pages/register/complete.vue' /* webpackChunkName: "pages/register/complete" */))
const _104532be = () => interopDefault(import('../../front-user/pages/register/form.vue' /* webpackChunkName: "pages/register/form" */))
const _b7fb8a7a = () => interopDefault(import('../../front-user/pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/login",
      component: _6da9ddda,
      name: "login"
    }, {
      path: "/register/auth-group",
      component: _36240137,
      name: "register-auth-group"
    }, {
      path: "/register/complete",
      component: _28fdc3d4,
      name: "register-complete"
    }, {
      path: "/register/form",
      component: _104532be,
      name: "register-form"
    }, {
      path: "/",
      component: _b7fb8a7a,
      name: "index"
    }],

    fallback: false
  })
}
