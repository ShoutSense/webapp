import store from '../../store'
import apgClientFactory from 'aws-api-gateway-client'

const apiGatewayConfig = {
  invokeUrl: 'https://api.shoutsense.com',
  apiKey: 'h2IRNxNPLW9vAv1vthM065aksBGdKZDu2VrdmOhl',
  systemClockOffset: 0, // OPTIONAL: An offset value in milliseconds to apply to signing time
  retries: 2, // OPTIONAL: Number of times to retry before failing. Uses axon-retry plugin.
  retryCondition: (err) => { // OPTIONAL: Callback to further control if request should be retried.  Uses axon-retry plugin.
    return err.response.status === 500
  }
}
let apiGateway = null

function ensureApiInitialized (creds) {
  if (apiGateway == null) {
    console.log('initializing gateway with creds... ')
    apiGatewayConfig.accessKey = creds.AccessKeyId
    apiGatewayConfig.secretKey = creds.SecretKey
    apiGatewayConfig.sessionToken = creds.SessionToken
    apiGateway = apgClientFactory.newClient(apiGatewayConfig)
  }
}

function additionalParameters () {
  return {
    headers: {},
    queryParams: {}
  }
}
/** REQUEST SAMPLE
let params = {
  // This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
}
// Template syntax follows url-template https://www.npmjs.com/package/url-template
// let pathTemplate = '/users/{userID}/profile'
let pathTemplate = '/campaigns'
let method = 'POST'
let additionalParams = {
  // If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
  headers: {
  },
  queryParams: {
  }
}
let body = {
  tweet_text: campaignPayload.tweet_text
}
******/

const actions = {
  async postAdvertiserAccountTransaction ({ dispatch, rootState, commit }, transactionAddress, networkName) {
    await dispatch('cognito/put', {
      key: 'advertiser_account_transaction',
      value: transactionAddress
    })
    ensureApiInitialized(store.state.auth.cognitoCredentials)
    let response = await apiGateway.invokeApi({}, '/advertisers', 'POST', additionalParameters(), { transaction: transactionAddress, network: networkName, type: 'advertiser_account_validation' })
    return response.data
  },
  async createCampaign ({ dispatch, rootState, commit }, campaignPayload) {
    ensureApiInitialized(store.state.auth.cognitoCredentials)
    let response = await apiGateway.invokeApi({}, '/campaigns', 'POST', additionalParameters(), { tweet_text: campaignPayload.tweet_text })
    return response.data
  }
}

export default {
  actions
}
