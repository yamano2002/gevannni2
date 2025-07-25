import Vue from 'vue'
import middleware from './middleware.js'
import {
  applyAsyncData,
  sanitizeComponent,
  resolveRouteComponents,
  getMatchedComponents,
  getMatchedComponentsInstances,
  flatMapComponents,
  setContext,
  middlewareSeries,
  promisify,
  getLocation,
  compile,
  getQueryDiff,
  globalHandleError
} from './utils.js'
import { createApp, NuxtError } from './index.js'
import NuxtLink from './components/nuxt-link.client.js' // should be included after ./index.js

// Component: <NuxtLink>
Vue.component(NuxtLink.name, NuxtLink)
Vue.component('NLink', NuxtLink)

// Global shared references
let _lastPaths = []
let app
let router
let store

// Try to rehydrate SSR data from window
const NUXT = window.__NUXT__ || {}

Object.assign(Vue.config, {"silent":true,"performance":false})

const errorHandler = Vue.config.errorHandler || console.error

// Create and mount App
createApp()
  .then(mountApp)
  .catch((err) => {
    err.message = '[nuxt] Error while mounting app: ' + err.message
    errorHandler(err)
  })

function componentOption(component, key, ...args) {
  if (!component || !component.options || !component.options[key]) {
    return {}
  }
  const option = component.options[key]
  if (typeof option === 'function') {
    return option(...args)
  }
  return option
}

function mapTransitions(Components, to, from) {
  const componentTransitions = (component) => {
    const transition = componentOption(component, 'transition', to, from) || {}
    return (typeof transition === 'string' ? { name: transition } : transition)
  }

  return Components.map((Component) => {
    // Clone original object to prevent overrides
    const transitions = Object.assign({}, componentTransitions(Component))

    // Combine transitions & prefer `leave` transitions of 'from' route
    if (from && from.matched.length && from.matched[0].components.default) {
      const fromTransitions = componentTransitions(from.matched[0].components.default)
      Object.keys(fromTransitions)
        .filter(key => fromTransitions[key] && key.toLowerCase().includes('leave'))
        .forEach((key) => { transitions[key] = fromTransitions[key] })
    }

    return transitions
  })
}

async function loadAsyncComponents(to, from, next) {
  // Check if route path changed (this._pathChanged), only if the page is not an error (for validate())
  this._pathChanged = !!app.nuxt.err || from.path !== to.path
  this._queryChanged = JSON.stringify(to.query) !== JSON.stringify(from.query)
  this._diffQuery = (this._queryChanged ? getQueryDiff(to.query, from.query) : [])

  if (this._pathChanged && this.$loading.start && !this.$loading.manual) {
    this.$loading.start()
  }

  try {
    const Components = await resolveRouteComponents(to)

    if (!this._pathChanged && this._queryChanged) {
      // Add a marker on each component that it needs to refresh or not
      const startLoader = Components.some((Component) => {
        const watchQuery = Component.options.watchQuery
        if (watchQuery === true) return true
        if (Array.isArray(watchQuery)) {
          return watchQuery.some(key => this._diffQuery[key])
        }
        return false
      })
      if (startLoader && this.$loading.start && !this.$loading.manual) {
        this.$loading.start()
      }
    }

    // Call next()
    next()
  } catch (error) {
    const err = error || {}
    const statusCode = err.statusCode || err.status || (err.response && err.response.status) || 500
    const message = err.message || ''

    // Handle chunk loading errors
    // This may be due to a new deployment or a network problem
    if (/^Loading chunk (\d)+ failed\./.test(message)) {
      window.location.reload(true /* skip cache */)
      return // prevent error page blinking for user
    }

    this.error({ statusCode, message })
    this.$nuxt.$emit('routeChanged', to, from, err)
    next()
  }
}

function applySSRData(Component, ssrData) {
  if (NUXT.serverRendered && ssrData) {
    applyAsyncData(Component, ssrData)
  }
  Component._Ctor = Component
  return Component
}

// Get matched components
function resolveComponents(router) {
  const path = getLocation(router.options.base, router.options.mode)

  return flatMapComponents(router.match(path), async (Component, _, match, key, index) => {
    // If component is not resolved yet, resolve it
    if (typeof Component === 'function' && !Component.options) {
      Component = await Component()
    }
    // Sanitize it and save it
    const _Component = applySSRData(sanitizeComponent(Component), NUXT.data ? NUXT.data[index] : null)
    match.components[key] = _Component
    return _Component
  })
}

function callMiddleware(Components, context, layout) {
  let midd = ["authenticated"]
  let unknownMiddleware = false

  // If layout is undefined, only call global middleware
  if (typeof layout !== 'undefined') {
    midd = [] // Exclude global middleware if layout defined (already called before)
    layout = sanitizeComponent(layout)
    if (layout.options.middleware) {
      midd = midd.concat(layout.options.middleware)
    }
    Components.forEach((Component) => {
      if (Component.options.middleware) {
        midd = midd.concat(Component.options.middleware)
      }
    })
  }

  midd = midd.map((name) => {
    if (typeof name === 'function') return name
    if (typeof middleware[name] !== 'function') {
      unknownMiddleware = true
      this.error({ statusCode: 500, message: 'Unknown middleware ' + name })
    }
    return middleware[name]
  })

  if (unknownMiddleware) return
  return middlewareSeries(midd, context)
}

async function render(to, from, next) {
  if (this._pathChanged === false && this._queryChanged === false) return next()
  // Handle first render on SPA mode
  if (to === from) _lastPaths = []
  else {
    const fromMatches = []
    _lastPaths = getMatchedComponents(from, fromMatches).map((Component, i) => {
      return compile(from.matched[fromMatches[i]].path)(from.params)
    })
  }

  // nextCalled is true when redirected
  let nextCalled = false
  const _next = (path) => {
    if (from.path === path.path && this.$loading.finish) {
      this.$loading.finish()
    }

    if (from.path !== path.path && this.$loading.pause) {
      this.$loading.pause()
    }

    if (nextCalled) return
    nextCalled = true
    next(path)
  }

  // Update context
  await setContext(app, {
    route: to,
    from,
    next: _next.bind(this)
  })
  this._dateLastError = app.nuxt.dateErr
  this._hadError = !!app.nuxt.err

  // Get route's matched components
  const matches = []
  const Components = getMatchedComponents(to, matches)

  // If no Components matched, generate 404
  if (!Components.length) {
    // Default layout
    await callMiddleware.call(this, Components, app.context)
    if (nextCalled) return
    // Load layout for error page
    const layout = await this.loadLayout(
      typeof NuxtError.layout === 'function'
        ? NuxtError.layout(app.context)
        : NuxtError.layout
    )
    await callMiddleware.call(this, Components, app.context, layout)
    if (nextCalled) return
    // Show error page
    app.context.error({ statusCode: 404, message: `This page could not be found` })
    return next()
  }

  // Update ._data and other properties if hot reloaded
  Components.forEach((Component) => {
    if (Component._Ctor && Component._Ctor.options) {
      Component.options.asyncData = Component._Ctor.options.asyncData
      Component.options.fetch = Component._Ctor.options.fetch
    }
  })

  // Apply transitions
  this.setTransitions(mapTransitions(Components, to, from))

  try {
    // Call middleware
    await callMiddleware.call(this, Components, app.context)
    if (nextCalled) return
    if (app.context._errored) return next()

    // Set layout
    let layout = Components[0].options.layout
    if (typeof layout === 'function') {
      layout = layout(app.context)
    }
    layout = await this.loadLayout(layout)

    // Call middleware for layout
    await callMiddleware.call(this, Components, app.context, layout)
    if (nextCalled) return
    if (app.context._errored) return next()

    // Call .validate()
    let isValid = true
    try {
      for (const Component of Components) {
        if (typeof Component.options.validate !== 'function') {
          continue
        }

        isValid = await Component.options.validate(app.context)

        if (!isValid) {
          break
        }
      }
    } catch (validationError) {
      // ...If .validate() threw an error
      this.error({
        statusCode: validationError.statusCode || '500',
        message: validationError.message
      })
      return next()
    }

    // ...If .validate() returned false
    if (!isValid) {
      this.error({ statusCode: 404, message: `This page could not be found` })
      return next()
    }

    // Call asyncData & fetch hooks on components matched by the route.
    await Promise.all(Components.map((Component, i) => {
      // Check if only children route changed
      Component._path = compile(to.matched[matches[i]].path)(to.params)
      Component._dataRefresh = false
      // Check if Component need to be refreshed (call asyncData & fetch)
      // Only if its slug has changed or is watch query changes
      if ((this._pathChanged && this._queryChanged) || Component._path !== _lastPaths[i]) {
        Component._dataRefresh = true
      } else if (!this._pathChanged && this._queryChanged) {
        const watchQuery = Component.options.watchQuery
        if (watchQuery === true) {
          Component._dataRefresh = true
        } else if (Array.isArray(watchQuery)) {
          Component._dataRefresh = watchQuery.some(key => this._diffQuery[key])
        }
      }
      if (!this._hadError && this._isMounted && !Component._dataRefresh) {
        return Promise.resolve()
      }

      const promises = []

      const hasAsyncData = (
        Component.options.asyncData &&
        typeof Component.options.asyncData === 'function'
      )
      const hasFetch = !!Component.options.fetch

      const loadingIncrease = (hasAsyncData && hasFetch) ? 30 : 45

      // Call asyncData(context)
      if (hasAsyncData) {
        const promise = promisify(Component.options.asyncData, app.context)
          .then((asyncDataResult) => {
            applyAsyncData(Component, asyncDataResult)

            if (this.$loading.increase) {
              this.$loading.increase(loadingIncrease)
            }
          })
        promises.push(promise)
      }

      // Check disabled page loading
      this.$loading.manual = Component.options.loading === false

      // Call fetch(context)
      if (hasFetch) {
        let p = Component.options.fetch(app.context)
        if (!p || (!(p instanceof Promise) && (typeof p.then !== 'function'))) {
          p = Promise.resolve(p)
        }
        p.then((fetchResult) => {
          if (this.$loading.increase) {
            this.$loading.increase(loadingIncrease)
          }
        })
        promises.push(p)
      }

      return Promise.all(promises)
    }))

    // If not redirected
    if (!nextCalled) {
      if (this.$loading.finish && !this.$loading.manual) {
        this.$loading.finish()
      }

      next()
    }
  } catch (err) {
    const error = err || {}
    if (error.message === 'ERR_REDIRECT') {
      return this.$nuxt.$emit('routeChanged', to, from, error)
    }
    _lastPaths = []

    globalHandleError(error)

    // Load error layout
    let layout = NuxtError.layout
    if (typeof layout === 'function') {
      layout = layout(app.context)
    }
    await this.loadLayout(layout)

    this.error(error)
    this.$nuxt.$emit('routeChanged', to, from, error)
    next()
  }
}

// Fix components format in matched, it's due to code-splitting of vue-router
function normalizeComponents(to, ___) {
  flatMapComponents(to, (Component, _, match, key) => {
    if (typeof Component === 'object' && !Component.options) {
      // Updated via vue-router resolveAsyncComponents()
      Component = Vue.extend(Component)
      Component._Ctor = Component
      match.components[key] = Component
    }
    return Component
  })
}

function showNextPage(to) {
  // Hide error component if no error
  if (this._hadError && this._dateLastError === this.$options.nuxt.dateErr) {
    this.error()
  }

  // Set layout
  let layout = this.$options.nuxt.err
    ? NuxtError.layout
    : to.matched[0].components.default.options.layout

  if (typeof layout === 'function') {
    layout = layout(app.context)
  }
  this.setLayout(layout)
}

// When navigating on a different route but the same component is used, Vue.js
// Will not update the instance data, so we have to update $data ourselves
function fixPrepatch(to, ___) {
  if (this._pathChanged === false && this._queryChanged === false) return

  Vue.nextTick(() => {
    const matches = []
    const instances = getMatchedComponentsInstances(to, matches)
    const Components = getMatchedComponents(to, matches)

    instances.forEach((instance, i) => {
      if (!instance) return
      // if (
      //   !this._queryChanged &&
      //   to.matched[matches[i]].path.indexOf(':') === -1 &&
      //   to.matched[matches[i]].path.indexOf('*') === -1
      // ) return // If not a dynamic route, skip
      if (
        instance.constructor._dataRefresh &&
        Components[i] === instance.constructor &&
        typeof instance.constructor.options.data === 'function'
      ) {
        const newData = instance.constructor.options.data.call(instance)
        for (const key in newData) {
          Vue.set(instance.$data, key, newData[key])
        }
      }
    })
    showNextPage.call(this, to)
  })
}

function nuxtReady(_app) {
  window.onNuxtReadyCbs.forEach((cb) => {
    if (typeof cb === 'function') {
      cb(_app)
    }
  })
  // Special JSDOM
  if (typeof window._onNuxtLoaded === 'function') {
    window._onNuxtLoaded(_app)
  }
  // Add router hooks
  router.afterEach((to, from) => {
    // Wait for fixPrepatch + $data updates
    Vue.nextTick(() => _app.$nuxt.$emit('routeChanged', to, from))
  })
}

async function mountApp(__app) {
  // Set global variables
  app = __app.app
  router = __app.router
  store = __app.store

  // Resolve route components
  const Components = await Promise.all(resolveComponents(router))

  // Create Vue instance
  const _app = new Vue(app)

  // Mounts Vue app to DOM element
  const mount = () => {
    _app.$mount('#__nuxt')

    // Listen for first Vue update
    Vue.nextTick(() => {
      // Call window.{{globals.readyCallback}} callbacks
      nuxtReady(_app)
    })
  }

  // Enable transitions
  _app.setTransitions = _app.$options.nuxt.setTransitions.bind(_app)
  if (Components.length) {
    _app.setTransitions(mapTransitions(Components, router.currentRoute))
    _lastPaths = router.currentRoute.matched.map(route => compile(route.path)(router.currentRoute.params))
  }

  // Initialize error handler
  _app.$loading = {} // To avoid error while _app.$nuxt does not exist
  if (NUXT.error) _app.error(NUXT.error)

  // Add router hooks
  router.beforeEach(loadAsyncComponents.bind(_app))
  router.beforeEach(render.bind(_app))
  router.afterEach(normalizeComponents)
  router.afterEach(fixPrepatch.bind(_app))

  // If page already is server rendered
  if (NUXT.serverRendered) {
    mount()
    return
  }

  // First render on client-side
  render.call(_app, router.currentRoute, router.currentRoute, (path) => {
    // If not redirected
    if (!path) {
      normalizeComponents(router.currentRoute, router.currentRoute)
      showNextPage.call(_app, router.currentRoute)
      // Don't call fixPrepatch.call(_app, router.currentRoute, router.currentRoute) since it's first render
      mount()
      return
    }

    // Push the path and then mount app
    router.push(path, () => mount(), (err) => {
      if (!err) return mount()
      errorHandler(err)
    })
  })
}
