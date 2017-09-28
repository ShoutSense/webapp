import Vue from 'vue'
import store from '../../store'
import router from '../../router'
import VueResource from 'vue-resource'
import VueAuthenticate from 'vue-authenticate'
import CognitoSync from 'vuex-cognito-sync'
import CognitoConfig from '../../../config/auth.json'

Vue.use(VueResource)

const vueAuth = VueAuthenticate.factory(Vue.http, {
  baseUrl: 'https://api.shoutsense.com',
  providers: {
    twitter: {
      clientId: CognitoConfig.TwitterConsumerKey,
      url: '/auth/twitter/request_token',
      redirectUri: 'http://localhost:8080/twitter_authorized',
      method: 'GET'
    }
  }
})

const state = {
  isInitialized: false,
  isAuthenticated: false,
  twitterAccessToken: null,
  twitterScreenname: null,
  cognitoCredentials: null,
  publisherAccountId: null,
  advertiserAccountId: null,
  publisherAccountValidated: false,
  advertiserAccountValidated: false
}

const mutations = {
  setIsInitialized (state, isInit) {
    state.isInitialized = isInit
  },
  setIsAuthenticated (state, isAuth) {
    state.isAuthenticated = isAuth
  },
  setTwitterAccessToken (state, token) {
    state.twitterAccessToken = token
  },
  setTwitterScreenname (state, screenName) {
    state.twitterScreenname = screenName
  },
  setCognitoCredentials (state, creds) {
    state.cognitoCredentials = creds
  },
  setAdvertiserAccountId (state, accountId) {
    state.advertiserAccountId = accountId
  },
  setPublisherAccountId (state, accountId) {
    state.publisherAccountId = accountId
  },
  setAdvertiserAccountValidated (state, validated) {
    state.advertiserAccountValidated = validated
  },
  setPublisherAccountValidated (state, validated) {
    state.publisherAccountValidated = validated
  }
}

const actions = {
  async initializeAuth ({ dispatch, state, commit }) {
    if (!vueAuth.getToken()) {
      await dispatch('signout')
      store.commit('setIsInitialized', true)
      if (store.state.route.query.redirect) {
        router.push({path: store.state.route.query.redirect, query: { }})
      }
      return
    }
    console.log('starting initializeAuth with twitter token ' + vueAuth.getToken() + ' ?= ' + state.twitterAccessToken + '...')
    let logins = {}
    if (vueAuth.getToken()) {
      logins['api.twitter.com'] = vueAuth.getToken()
    }

    if (!CognitoSync.context.manager) {
      console.log('about call CognitoSync.init()...')
      await CognitoSync.init(CognitoConfig, logins)
    } else {
      console.log('about call CognitoSync.authenticate()...')
      await CognitoSync.authenticate(CognitoConfig, logins)
    }
    store.commit('setIsAuthenticated', true)
    store.commit('setTwitterAccessToken', vueAuth.getToken())
    store.commit('setCognitoCredentials', CognitoSync.context.credentials.data.Credentials)
    console.log('cognito id info: ' + CognitoSync.context.credentials.data.IdentityId)
    console.log('does cognito dataset already exist? ' + (store.state.cognito !== 'undefined'))
    if (!store.state.cognito) {
      console.log('about to init dataset...')
      store.registerModule('cognito', new CognitoSync('ShoutsensePublicDataset'))
      await dispatch('cognito/init')
      console.log('initialized dataset, about to sync it...')
      await dispatch('cognito/sync')
      console.log('synced dataset: ' + JSON.stringifyOnce(store.state.cognito, null, 2))
    }
    await dispatch('cognito/put', {
      key: 'twitter_accesstoken',
      value: vueAuth.getToken()
    })
    await dispatch('incrementUserBehaviorEvent', {'event': 'auth_initialized'})
    await dispatch('cognito/sync')
    store.commit('setTwitterScreenname', store.state.cognito.twitter_screenname)
    store.commit('setAdvertiserAccountId', store.state.cognito.advertiser_account_id)
    store.commit('setPublisherAccountId', store.state.cognito.publisher_account_id)
    store.commit('setAdvertiserAccountValidated', store.state.cognito.advertiser_account_validated === 'true')
    store.commit('setPublisherAccountValidated', store.state.cognito.publisher_account_validated === 'true')
    console.log('dataset fully synced, starting sync monitor. dataset: ' + JSON.stringifyOnce(store.state.cognito, null, 2))
    store.commit('setIsInitialized', true)
    if (store.state.route.query.redirect) {
      router.push({path: store.state.route.query.redirect, query: { }})
    }
    setTimeout(() => {
      store.dispatch('monitorSyncChanges')
    }, 5000)
  },
  async monitorSyncChanges ({ dispatch, state }) {
    if (state.isAuthenticated) {
      await dispatch('cognito/sync')
      store.commit('setAdvertiserAccountValidated', store.state.cognito.advertiser_account_validated === 'true')
      store.commit('setPublisherAccountValidated', store.state.cognito.publisher_account_validated === 'true')
    }
    setTimeout(() => {
      store.dispatch('monitorSyncChanges')
    }, 5000)
  },
  async authenticateAll ({ dispatch, commit, rootState }) {
    console.log('user login started...')
    await vueAuth.authenticate('twitter')
    await dispatch('initializeAuth')
    console.log('full reauthentication complete')
    if (store.state.route.query.redirect) {
      router.push({path: store.state.route.query.redirect, query: { }})
    }
  },

  async signout ({ dispatch, commit, state }) {
    if (vueAuth.getToken()) {
      console.log('user log out started...')
      await vueAuth.logout()
    }
    store.commit('setIsAuthenticated', false)
    store.commit('setTwitterAccessToken', null)
    store.commit('setCognitoCredentials', null)
    store.commit('setTwitterScreenname', null)
    store.commit('setAdvertiserAccountId', null)
    store.commit('setPublisherAccountId', null)
    if (store.state.cognito) {
      await dispatch('cognito/sync')
      store.unregisterModule('cognito')
    }
    console.log('twitter token after signout: ' + vueAuth.getToken() + '==' + state.twitterAccessToken)
    console.log('user is logged out')
  }
}

export default {
  state,
  mutations,
  actions
}
