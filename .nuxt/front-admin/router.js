import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _6a5b3c58 = () => interopDefault(import('../../front-admin/pages/create_mail/index.vue' /* webpackChunkName: "pages/create_mail/index" */))
const _005f13bd = () => interopDefault(import('../../front-admin/pages/group/index.vue' /* webpackChunkName: "pages/group/index" */))
const _41e49d53 = () => interopDefault(import('../../front-admin/pages/lists/index.vue' /* webpackChunkName: "pages/lists/index" */))
const _2dd5f4a4 = () => interopDefault(import('../../front-admin/pages/login.vue' /* webpackChunkName: "pages/login" */))
const _4c0caf42 = () => interopDefault(import('../../front-admin/pages/logout.vue' /* webpackChunkName: "pages/logout" */))
const _dfd91838 = () => interopDefault(import('../../front-admin/pages/mail_history/index.vue' /* webpackChunkName: "pages/mail_history/index" */))
const _0ac88f00 = () => interopDefault(import('../../front-admin/pages/mail_template/index.vue' /* webpackChunkName: "pages/mail_template/index" */))
const _06bcc3dd = () => interopDefault(import('../../front-admin/pages/send_mail_setting/index.vue' /* webpackChunkName: "pages/send_mail_setting/index" */))
const _7d633bbb = () => interopDefault(import('../../front-admin/pages/settings/index.vue' /* webpackChunkName: "pages/settings/index" */))
const _7cb1fcf0 = () => interopDefault(import('../../front-admin/pages/group/register.vue' /* webpackChunkName: "pages/group/register" */))
const _70c2deca = () => interopDefault(import('../../front-admin/pages/mail_history/_sentMailId.vue' /* webpackChunkName: "pages/mail_history/_sentMailId" */))
const _642e518d = () => interopDefault(import('../../front-admin/pages/index.vue' /* webpackChunkName: "pages/index" */))

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
      path: "/create_mail",
      component: _6a5b3c58,
      name: "create_mail"
    }, {
      path: "/group",
      component: _005f13bd,
      name: "group"
    }, {
      path: "/lists",
      component: _41e49d53,
      name: "lists"
    }, {
      path: "/login",
      component: _2dd5f4a4,
      name: "login"
    }, {
      path: "/logout",
      component: _4c0caf42,
      name: "logout"
    }, {
      path: "/mail_history",
      component: _dfd91838,
      name: "mail_history"
    }, {
      path: "/mail_template",
      component: _0ac88f00,
      name: "mail_template"
    }, {
      path: "/send_mail_setting",
      component: _06bcc3dd,
      name: "send_mail_setting"
    }, {
      path: "/settings",
      component: _7d633bbb,
      name: "settings"
    }, {
      path: "/group/register",
      component: _7cb1fcf0,
      name: "group-register"
    }, {
      path: "/mail_history/:sentMailId",
      component: _70c2deca,
      name: "mail_history-sentMailId"
    }, {
      path: "/",
      component: _642e518d,
      name: "index"
    }],

    fallback: false
  })
}
