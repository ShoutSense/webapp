
const actions = {
  async incrementUserBehaviorEvent ({ dispatch, rootState, commit }, eventPayload) {
    await dispatch('cognito/put', {
      key: eventPayload.event,
      value: '' + ((rootState.cognito[eventPayload.event] === undefined) ? 1 : Number(rootState.cognito[eventPayload.event]) + 1)
    })
    // let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    // await wait(2000)
    // await dispatch('cognito/sync')
    console.log('event count now for ' + eventPayload.event + ': ' + rootState.cognito[eventPayload.event])
  },
  async trackEvent ({ dispatch, rootState, commit }, eventPayload) {
    console.log('tracking event occurred: ' + JSON.stringify(eventPayload, null, 2))
    /*
    let pageCountKey = 'page_count_' + eventPayload.page_name
    dispatch('ShoutsensePublicDataset/put', {
      key: pageCountKey,
      value: '' + ((state.ShoutsensePublicDataset[pageCountKey] === undefined) ? 1 : Number(state.ShoutsensePublicDataset[pageCountKey]) + 1)
    })
    .then(() => {
      console.log('pageCount count now for ' + pageCountKey + ': ' + state.ShoutsensePublicDataset[pageCountKey])
    })
    dispatch('ShoutsensePublicDataset/sync')
    */
  }
}

export default {
  actions
}
