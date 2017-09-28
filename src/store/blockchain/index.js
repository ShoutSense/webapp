import store from '../../store'
import { default as contract } from 'truffle-contract'
import shoutsenseArtifacts from '../../../build/contracts/ShoutSense.json'
import advertiserAccountArtifacts from '../../../build/contracts/AdvertiserAccount.json'
import publisherAccountArtifacts from '../../../build/contracts/PublisherAccount.json'
import GasInfo from '../../../config/gas_info.json'

// const Web3 = require('web3')
const Eth = require('ethjs')
let ethInstance = null
const ShoutSense = contract(shoutsenseArtifacts)
const AdvertiserAccount = contract(advertiserAccountArtifacts)
const PublisherAccount = contract(publisherAccountArtifacts)
let shoutsenseInstance = null

const state = {
  web3Available: false,
  currentNetwork: null,
  currentBlock: '',
  fullMonitorScanComplete: false,
  shoutsenseAvailable: false,
  advertiserAccountAddress: null,
  publisherAccountAddress: null,
  firstScanStagesComplete: 0,
  availableEthereumAddresses: [],
  advertiserAccountTransactionInProgress: false
}

const mutations = {
  setAvailableEthereumAddresses (state, availableAddresses) {
    state.availableEthereumAddresses = availableAddresses
  },
  setCurrentBlock (state, block) {
    state.currentBlock = block
  },
  setWeb3Available (state, available) {
    state.web3Available = available
  },
  setShoutsenseAvailable (state, available) {
    state.shoutsenseAvailable = available
  },
  setPublisherAccountAddress (state, address) {
    state.publisherAccountAddress = address
  },
  setAdvertiserAccountAddress (state, address) {
    state.advertiserAccountAddress = address
  },
  setCurrentNetwork (state, network) {
    state.currentNetwork = network
  },
  incrementMonitorScan (state) {
    if (!state.fullMonitorScanComplete) {
      state.firstScanStagesComplete++

      // the following should only be 2, one for Ad, one for Pub.
      // But it has to run through the monitor twice to catch....WHY???
      if (state.firstScanStagesComplete === 4) {
        state.fullMonitorScanComplete = true
      }
    }
  }
}

const actions = {
  async initializeBlockchain ({ commit, state }) {
    console.log('initializing blockchain...')
    if (!window.web3) {
      throw new Error('web3 is not available')
    }
    ShoutSense.setProvider(window.web3.currentProvider)
    AdvertiserAccount.setProvider(window.web3.currentProvider)
    PublisherAccount.setProvider(window.web3.currentProvider)
    if (!ethInstance) {
      ethInstance = new Eth(window.web3.currentProvider)
      store.commit('setWeb3Available', true)
      console.log('initialized eth instance')
      store.dispatch('monitorBlockchainChanges')
    }
  },
  async monitorBlockchainChanges ({ commit, state }) {
    let networkId = await ethInstance.net_version()
    if (networkId === '1') {
      networkId = 'mainnet'
    } else if (networkId === '3') {
      networkId = 'ropsten'
    } else {
      networkId = 'testnet'
    }
    let networkChanged = networkId !== state.currentNetwork
    if (networkChanged) {
      console.log('current blockchain network: ' + networkId)
      store.commit('setCurrentNetwork', networkId)
      try {
        shoutsenseInstance = await ShoutSense.deployed()
        store.commit('setShoutsenseAvailable', shoutsenseInstance != null)
        if (shoutsenseInstance) {
          console.log('Shoutsense available on ' + networkId + ' at ' + shoutsenseInstance.address)
        }
      } catch (error) {
        store.commit('setShoutsenseAvailable', null)
        console.warn('ShoutSense is not available on the current network')
        state.fullMonitorScanComplete = true
      }
    }
    // the user may create accounts on the fly, we need to detect them
    await store.dispatch('monitorEthereumAddresses')

    // monitor the accounts
    if (shoutsenseInstance) {
      await store.dispatch('monitorAdvertiserAccountStatus')
      await store.dispatch('monitorPublisherAccountStatus')
    }

    setTimeout(() => {
      store.dispatch('monitorBlockchainChanges')
    }, 5000)
  },
  async monitorAdvertiserAccountStatus ({ commit, rootState, state }) {
    let accountAddress = null
    let accountId = rootState.auth.advertiserAccountId
    if (accountId) {
      accountAddress = await shoutsenseInstance.getAdvertiserAccount(accountId)
      if (!Eth.isAddress(accountAddress) || accountAddress === '0x0000000000000000000000000000000000000000') {
        accountAddress = null
      } else {
        let account = AdvertiserAccount.at(accountAddress)
        let instanceAccountId = await account.getOwnerAccountId()
        if (instanceAccountId !== accountId) {
          console.error(instanceAccountId + ' SHOULD MATCH ' + accountId)
        }
      }
      if (state.advertiserAccountAddress !== accountAddress) {
        console.log('advertiser account address found on blockchain: ' + accountAddress)
        store.commit('setAdvertiserAccountAddress', accountAddress)
      }
    }
    store.commit('incrementMonitorScan')
  },
  async monitorPublisherAccountStatus ({ commit, rootState, state }) {
    let accountAddress = null
    let accountId = rootState.auth.publisherAccountId
    if (accountId) {
      // accountAddress = await shoutsenseInstance.getPublisherAccount(accountId)
      if (!Eth.isAddress(accountAddress) || accountAddress === '0x0000000000000000000000000000000000000000') {
        accountAddress = null
      } else {
        let account = PublisherAccount.at(accountAddress)
        let instanceAccountId = await account.getOwnerAccountId()
        if (instanceAccountId !== accountId) {
          console.error(instanceAccountId + ' SHOULD MATCH ' + accountId)
        }
      }
      if (state.publisherAccountAddress !== accountAddress) {
        console.log('publisher account address found on blockchain: ' + accountAddress)
        store.commit('setPublisherAccountAddress', accountAddress)
      }
    }
    store.commit('incrementMonitorScan')
  },
  async monitorEthereumAddresses ({ commit, state }) {
    let accounts = await ethInstance.accounts()
    store.commit('setAvailableEthereumAddresses', accounts)
  },
  async createAdvertiserAccount ({ dispatch, state, rootState }, selectedFundingAddress) {
    if (Eth.isAddress(selectedFundingAddress)) {
      let accountId = rootState.auth.advertiserAccountId
      let estimatedGas = 0
      let transactionReceiptAddress = null
      try {
        console.log(Eth.isHexString(accountId) + ' ' + estimatedGas + ' creating advertiser account on blockchain: ' + accountId + ' from funding account: ' + selectedFundingAddress)
        state.advertiserAccountTransactionInProgress = true
        let transactionReceipt = await shoutsenseInstance.createAdvertiserAccount(
          accountId, {
            from: selectedFundingAddress,
            gas: GasInfo.CreateAccountCall.gas_limit,
            gasPrice: GasInfo.CreateAccountCall.gas_price
          })
        transactionReceiptAddress = transactionReceipt.tx
      } catch (error) {
        if (error.message.includes('User denied')) {
          store.dispatch('showWarningSnackbar', 'Still Unsure? Check out our FAQ!')
        } else {
          if (error.message.startsWith('Transaction ') && error.message.endsWith(' wasn\'t processed in 240 seconds!')) {
            transactionReceiptAddress = error.message.substr(12, 66)
            // this means the transaction is still pending, taking too long, but proceed and record it anyway
          } else {
            console.error(error)
            store.dispatch('showErrorSnackbar', 'An error occurred with this transaction: ' + error)
          }
        }
      }
      state.advertiserAccountTransactionInProgress = false
      if (transactionReceiptAddress != null) {
        console.log('resulting transaction: ' + transactionReceiptAddress)
        store.dispatch('postAdvertiserAccountTransaction', transactionReceiptAddress, state.currentNetwork)
      }
    }
  },
  createPublisherAccount ({ dispatch, state }, selectFundingAddress) {
  },
  fundAdvertiserAccount ({ dispatch, state }, advertiserFundingAddress) {

  },
  /*
  monitorUnverifiedTransactions ({ dispatch, statee }) {
    if (!store.state.cognito) {
      return
    }
    let unverifiedTransactions = store.state.cognito.unverified_transactions
    if (unverifiedTransactions) {
      unverifiedTransactions.forEach(
        function(unverifiedTransaction) {

        });
    }
  },
  monitorUnverifiedTransaction ({ dispatch, state }, transactionReceipt, modelType) {
    if (!transactionReceipt || !modelType || !transactionReceipt.tx) {
      return
    }
    console.log('transaction to monitor: ' + JSON.stringify(transactionReceipt))
    let unverifiedTransactions = store.state.cognito.unverified_transactions
    if (!unverifiedTransactions) {
      unverifiedTransactions = []
    }
    let unverifiedTransaction = {}
    unverifiedTransaction.address = transactionReceipt.tx
    unverifiedTransaction.modelType = modelType
    unverifiedTransactions.push(unverifiedTransaction)
    await dispatch('cognito/put', {
      key: 'unverified_transactions',
      value: unverifiedTransactions
    })
    await dispatch('cognito/sync')
  },
  */

  async testTransaction ({ dispatch, state }, selectedAddress) {
    let transactionId = await ethInstance.sendTransaction({
      from: selectedAddress,
      to: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
      value: Eth.toWei(0.001, 'ether'),
      gas: '200000',
      data: '0x1234567'
    })
    console.log('transaction: ' + transactionId)
    let receipt = await ethInstance.getTransactionReceipt(transactionId)
    console.log('transaction receipt for ' + transactionId + ': ' + JSON.stringify(receipt))
    return transactionId
  },
  async monitorBlockNumber ({ dispatch, rootState, commit, state }) {
    if (!ethInstance) {
      store.commit('setCurrentBlock', null)
    } else {
      let blockData = await ethInstance.getBlockByNumber('latest', true)
      store.commit('setCurrentBlock', '' + blockData.number)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
