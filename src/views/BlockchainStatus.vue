<template>
  <v-card class="ma-3">
    <v-container grid-list-md text-xs-center>
      <v-layout column>
        <v-flex xs12>
          <v-card>
            <v-card-text light class="body-2 px-0 ml-2 mb-2">
              BLOCKCHAIN STATUS
            </v-card-text>
          </v-card>
          <v-flex xs12 v-show="!blockchainMonitorScanComplete">
            <v-card>
              <v-card-text light class="px-0">
                <v-progress-circular indeterminate class="black--text"></v-progress-circular>
                <v-card-text light class="px-0">
                  Scanning for Ethereum Blockchain Connection Now
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-card v-show="blockchainMonitorScanComplete">
            <v-card-text light class="px-0 ml-2">
              Ethereum Network<br/>
              <v-chip
                class="blue white--text"
                v-show="connectedToNetwork">
                <v-avatar>
                  <v-icon medium>fa-check-circle</v-icon>
                </v-avatar>
                {{ this.$store.state.blockchain.currentNetwork }}
              </v-chip>
              <v-chip
                class="red white--text"
                v-show="!connectedToNetwork">
                <v-avatar>
                  <v-icon medium>fa-times-circle</v-icon>
                </v-avatar>
                Not Connected
              </v-chip>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && !connectedToNetwork">
          <v-card>
            <v-card-text light class="px-0">
              It appears you are not connected to the Ethereum blockchain.
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && !connectedToNetwork">
          <v-card>
            <v-card-text light class="px-0">
              Visit our FAQ to learn more about ShoutSense and Ethereum.
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && !connectedToNetwork">
          <v-card>
            <v-card-text light class="px-0">
              For the best experience, please install MetaMask
              <a target="_new" href="https://metamask.io/">
                <img width="80%" src="https://github.com/MetaMask/faq/raw/master/images/download-metamask.png"/>
              </a>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && !shoutsenseAvailable">
          <v-card>
            <v-card-text light class="px-0 ml-2">
              ShoutSense Contract<br/>
              <v-chip
                class="red white--text"
                v-show="!shoutsenseAvailable">
                <v-avatar>
                  <v-icon medium>fa-times-circle</v-icon>
                </v-avatar>
                Not Available
              </v-chip>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && !shoutsenseAvailable">
          <v-card>
            <v-card-text light class="px-0">
              Shoutsense is not available on the selected Ethereum network.
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && shoutsenseAvailable && viewingPublisherPage">
          <v-card>
            <v-card-text light class="px-0">
              Publisher Account<br/>
              <v-chip
                class="blue white--text"
                v-show="publisherAccountAvailable">
                <v-avatar>
                  <v-icon medium>fa-check-circle</v-icon>
                </v-avatar>
                Active
              </v-chip>
              <v-chip
                class="yellow black--text"
                v-show="!publisherAccountAvailable">
                <v-avatar>
                  <v-icon medium>fa-times-circle</v-icon>
                </v-avatar>
                Not Activated
              </v-chip>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && shoutsenseAvailable && viewingPublisherPage && !publisherAccountAvailable">
          <v-card>
            <v-card-text light class="px-1">
              You do not yet have a publisher account on the blockchain. Select which Ethereum address will be the primary for your publisher account.
              <v-select v-bind:items="availableEthereumAddresses" label="Select Primary" segmented></v-select>
              <v-btn class="green white--text" primary dark round>Get Started!</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && shoutsenseAvailable && viewingAdvertiserPage">
          <v-card>
            <v-card-text light class="px-0">
              Advertiser Account<br/>


              <v-chip
                class="yellow black--text"
                v-show="!advertiserAccountAvailable && !advertiserAccountCreationInProgress">
                <v-avatar>
                  <v-icon medium>fa-times-circle</v-icon>
                </v-avatar>
                Not Activated
              </v-chip>

              <v-card-text light class="px-0" v-show="!advertiserAccountAvailable && advertiserAccountCreationInProgress">
                <v-progress-circular indeterminate class="black--text"></v-progress-circular>
                <v-card-text light class="px-0">
                  Waiting for Blockchain Transaction
                </v-card-text>
                <v-card-text light class="px-0 caption">
                  (this can take several minutes)
                </v-card-text>
              </v-card-text>

              <v-card-text light class="px-0" v-show="advertiserAccountAvailable && !advertiserAccountValidated && !advertiserAccountCreationInProgress">
                <v-progress-circular indeterminate class="black--text"></v-progress-circular>
                <v-card-text light class="px-0">
                  Validation In Progress
                </v-card-text>
              </v-card-text>

              <v-chip
                class="blue white--text"
                v-show="advertiserAccountAvailable && advertiserAccountValidated">
                <v-avatar>
                  <v-icon medium>fa-check-circle</v-icon>
                </v-avatar>
                Validated
              </v-chip>

            </v-card-text>
          </v-card>

        </v-flex>
        <v-flex xs12 v-show="blockchainMonitorScanComplete && shoutsenseAvailable && viewingAdvertiserPage && !advertiserAccountAvailable && !advertiserAccountCreationInProgress">
          <v-card>
            <v-card-text light class="px-1">
              You do not yet have a advertiser account on the blockchain. Select which Ethereum address will be the primary for your publisher account.
              <v-select class="mt-3" v-model="selectedAdvertiserAddress" v-bind:items="availableEthereumAddresses" label="Select Primary"></v-select>

              <v-btn class="green white--text mt-0"
                primary dark round
                v-on:click="setupAdvertiserAccount">Get Started!</v-btn>
                <div class="caption mt-2">YOU WILL BE PROMPTED TO EXECUTE A SMALL SETUP TRANSACTION</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      selectedAdvertiserAddress: null
    }
  },
  computed: {
    blockchainMonitorScanComplete () {
      return this.$store.state.blockchain.fullMonitorScanComplete
    },
    connectedToNetwork () {
      return this.$store.state.blockchain.currentNetwork != null
    },
    shoutsenseAvailable () {
      return this.$store.state.blockchain.shoutsenseAvailable
    },
    publisherAccountAvailable () {
      return this.$store.state.blockchain.publisherAccountAddress != null
    },
    advertiserAccountAvailable () {
      return this.$store.state.blockchain.advertiserAccountAddress != null
    },
    advertiserAccountValidated () {
      return this.$store.state.auth.advertiserAccountValidated
    },
    advertiserAccountCreationInProgress () {
      return this.$store.state.blockchain.advertiserAccountTransactionInProgress
    },
    viewingPublisherPage () {
      return this.$store.state.route.path === '/app/publisher'
    },
    viewingAdvertiserPage () {
      return this.$store.state.route.path === '/app/advertiser'
    },
    availableEthereumAddresses () {
      return this.$store.state.blockchain.availableEthereumAddresses
    }
  },
  methods: {
    setupAdvertiserAccount () {
      this.$store.dispatch('startAdvertiserAccountSetup', this.selectedAdvertiserAddress)
    }
  }
}
</script>
