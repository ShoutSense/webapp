import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes
})

router.beforeEach((to, from, next) => {
  console.log('about to route to ' + to.fullPath)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.isInitialized) {
      next({
        path: '/loading',
        query: {
          redirect: to.fullPath
        }
      })
    } else if (!store.state.auth.isAuthenticated) {
      next({
        path: '/signup',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  console.log('routed to ' + to.fullPath)
  store.dispatch('trackEvent', {
    'event': 'route_page_view',
    'page_name': to.fullPath.split('/').join('_')
  })
})

export default router
