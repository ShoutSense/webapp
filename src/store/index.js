import Vue from 'vue'
import Vuex from 'vuex'
import analytics from './analytics'
import profile from './profile'
import apiGateway from './apigateway'
import auth from './auth'
import blockchain from './blockchain'
import ui from './ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    analytics,
    auth,
    blockchain,
    profile,
    apiGateway,
    ui
  }
})
