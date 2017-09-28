import store from '../../store'

const state = {
  showErrorSnackbarDialog: false,
  snackbarErrorMessage: '',
  showWarningSnackbarDialog: false,
  snackbarWarningMessage: '',
  startAdvertiserAccountSetup: false,
  selectedAddressForAdvertiserAccountSetup: null
}

const actions = {
  showErrorSnackbar ({ dispatch, state }, message) {
    state.snackbarErrorMessage = message
    state.showErrorSnackbarDialog = true
  },
  showWarningSnackbar ({ dispatch, state }, message) {
    state.snackbarWarningMessage = message
    state.showWarningSnackbarDialog = true
  },
  hideErrorSnackbar ({ dispatch, state }) {
    state.snackbarErrorMessage = ''
    state.showErrorSnackbarDialog = false
  },
  hideWarningSnackbar ({ dispatch, state }) {
    state.snackbarWarningMessage = ''
    state.showWarningSnackbarDialog = false
  },
  startAdvertiserAccountSetup ({ dispatch, state }, selectedAddress) {
    if (!selectedAddress) {
      store.dispatch('showErrorSnackbar', 'Please select a primary address')
    } else {
      state.startAdvertiserAccountSetup = true
      state.selectedAddressForAdvertiserAccountSetup = selectedAddress
    }
  },
  stopAdvertiserAccountSetup ({ dispatch, state, commit }) {
    state.startAdvertiserAccountSetup = false
    // do not null out the address though, as it can still be used in subsequent processes
  }
}

export default {
  actions,
  state
}
