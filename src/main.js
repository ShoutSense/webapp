import App from './App'
import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import BlockchainStatus from './components/BlockchainStatus'

Vue.use(Vuetify)
sync(store, router)
Vue.component('blockchain-status-card', BlockchainStatus)

window.addEventListener('load', () => {
  store.dispatch('initializeBlockchain')
    .then(() => {
      console.log('blockchain initialized from main')
      /* eslint-disable no-new */
      new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App },
        beforeCreate () {
          console.log('main app created, initializing auth...')
          this.$store.dispatch('initializeAuth').then(() => {
            console.log('auth initialized from main')
          })
        }
      }).$mount('#app')
    })
})
