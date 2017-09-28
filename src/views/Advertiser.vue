<template>
  <main>
    <v-container fluid>
      <v-layout row justify-right>
        <v-dialog v-model="dialog" persistent width="600px">
          <v-btn primary dark slot="activator">Add Campaign</v-btn>
          <v-card>
            <v-card-text>
            <v-stepper v-model="campaignCreationState">
              <v-stepper-header>
                <v-stepper-step step="1"
                  :complete="campaignCreationState > 1">
                  Setup Campaign
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2"
                :complete="campaignCreationState > 2">
                Verify Account</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Funding</v-stepper-step>
              </v-stepper-header>
              <v-stepper-content step="1">
                <div class="title grey--text">
                  <v-icon large class="light-blue--text pb-1">fa-twitter-square</v-icon>
                  Enter the tweet text you wish to have shared here</div>
                <v-card height="150px" class="elevation-0 mb-3">
                  <v-text-field
                    class="input-group--focused elevation-0 body-1"
                    :disabled="creatingCampaign == 'started' || creatingCampaign == 'done'"
                    v-model="tweetText"
                    :counter="160"
                    multi-line
                  >
                  </v-text-field>
                </v-card>
                <v-btn primary
                  @click="createCampaign"
                  :loading="creatingCampaign == 'started'"
                  :disabled="creatingCampaign == 'started' || creatingCampaign == 'done'">
                  {{ createCampaignButtonLabel }}
                </v-btn>
                <v-btn flat
                  @click="cancelDialog"
                  :disabled="creatingCampaign == 'started' || creatingCampaign == 'done'">
                  Nevermind
                </v-btn>
                <div class="caption grey--text">DON'T WORRY, THIS DOES NOT WRITE TO THE BLOCKCHAIN YET</div>
              </v-stepper-content>
              <v-stepper-content step="2" >
                <v-card class="mb-5 elevation-0" height="175px">
                  <div class="title grey--text">
                    An advertiser account is required to fund and activate ShoutSense campaigns.
                  </div>
                  <div class="title grey--text pt-5 pb-3" v-if="verifyingAccount === 'started'">
                    Checking the Ethereum Blockchain for a valid account...
                  </div>
                  <div class="title grey--text pt-5 pb-3" v-else-if="verifyingAccount === 'good'">
                    Your ShoutSense account was found! It currently has {{ accountBalance }} Ether.
                  </div>
                  <div class="title grey--text pt-5 pb-3" v-else-if="verifyingAccount === 'need_account'">
                    Ethereum found, but no ShoutSense account yet. For just a small gas fee, it's easy!
                  </div>
                  <div class="title grey--text pt-5 pb-3" v-else-if="verifyingAccount === 'need_web3'">
                    Checking the Ethereum Blockchain for a valid account...
                  </div>
                  <v-progress-circular
                    :indeterminate="verifyingAccount == 'started'"
                    v-bind:size="70"
                    v-bind:value="100"
                    v-bind:width="7"
                    v-bind:class="verifyingColor"
                    >
                  </v-progress-circular>
                </v-card>
                <v-btn primary
                  @click="verifyAccountButtonClickOld"
                  :disabled="verifyingAccount == 'started'">
                  {{ verifyAccountButtonLabel }}
                </v-btn>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-card class="grey lighten-1 mb-5" height="175px">Funding Here</v-card>
                <v-btn primary @click.native="dialog = false">Fund it!</v-btn>
                <v-btn flat @click="cancelDialog">Nevermind, I'll do this later</v-btn>
                <div class="caption grey--text">THIS WILL UPDATE THE BLOCKCHAIN</div>
              </v-stepper-content>
            </v-stepper>
          </v-card-text>
          </v-card>
        </v-dialog>
      </v-layout>
      <router-view></router-view>
      <v-dialog v-model="showTermsOfUseDialog" width="600px" persistent>
        <v-card>
          <v-card-title class="headline">ShoutSense Terms of Use</v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor. Ultrices nascetur nulla gravida ante arcu. Pharetra rhoncus morbi ipsum, nunc tempor debitis, ipsum pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. Phasellus quis lectus luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet, nibh praesent, elementum nulla. Sit lacus pharetra tempus magna neque pellentesque, nulla vel erat.
Justo ex quisque nulla accusamus venenatis, sed quis. Nibh phasellus gravida metus in, fusce aenean ut erat commodo eros. Ut turpis, dui integer, nonummy pede placeat nec in sit leo. Faucibus porttitor illo taciti odio, amet viverra scelerisque quis quis et tortor, curabitur morbi a. Enim tempor at, rutrum elit condimentum, amet rutrum vitae tempor torquent nunc. Praesent vestibulum integer maxime felis. Neque aenean quia vitae nostra, tempus elit enim id dui, at egestas pulvinar. Integer libero vestibulum, quis blandit scelerisque mattis fermentum nulla, tortor donec vestibulum dolor amet eget, elit nullam. Aliquam leo phasellus aliquam curabitur metus a, nulla justo mattis duis interdum vel, mollis vitae et id, vestibulum erat ridiculus sit pulvinar justo sed. Vehicula convallis, et nulla wisi, amet vestibulum risus, quam ac egestas.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="showTermsOfUseDialog = false">Nevermind</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="termsOfUseAccepted">Accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>

<script>
  let wait = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    data: function () {
      return {
        // wizard
        createCampaignButtonLabel: 'Create It!',
        verifyAccountButtonLabel: 'Verifying...',
        dialog: false,
        campaignCreationState: 0,
        tweetText: 'If you have a message to send, don\'t just tweet it, Shout it! #shoutsense',
        creatingCampaign: '',
        verifyingAccount: 'not_started',
        verifyingColor: 'transparent'
      }
    },
    computed: {
      showTermsOfUseDialog: {
        get: function () {
          return this.$store.state.ui.startAdvertiserAccountSetup
        },
        set: function (showIt) {
          if (!showIt) {
            this.$store.dispatch('stopAdvertiserAccountSetup')
          } // don't show it here
        }
      }
    },
    methods: {
      termsOfUseAccepted: function () {
        this.showTermsOfUseDialog = false
        let address = this.$store.state.ui.selectedAddressForAdvertiserAccountSetup
        this.$store.dispatch('stopAdvertiserAccountSetup')
        this.$store.dispatch('createAdvertiserAccount', address)
      },
      async createCampaign () {
        this.creatingCampaign = 'started'
        let campaign = {}
        campaign.tweet_text = this.tweetText
        console.log('create campaign with ' + JSON.stringify(campaign))
        await wait(2000)
        this.$store.dispatch('createCampaign', campaign)
          .then((response) => {
            console.log('new campaign id: ' + response.new_campaign_id)
            this.creatingCampaign = 'done'
            this.createCampaignButtonLabel = 'Done!'
            this.verifyAccountOld()
          })
      },
      async verifyAccountOld () {
        this.verifyingAccount = 'started'
        this.campaignCreationState = 2
        this.verifyAccountButtonLabel = 'Verifying...'
        this.verifyingColor = 'black--text'

        await wait(2000)
        this.$store.dispatch('initializeBlockchain')
          .then((address) => {
            // console.log('blockchain initialized???: ' + address)
            if (address) {
              this.verifyingAccount = 'good'
              this.verifyingColor = 'green--text'
            } else {
              this.verifyingAccount = 'need_account'
              this.verifyingColor = 'yellow--text'
            }
          })
          .catch((error) => {
            console.error(error)
            this.verifyingAccount = 'need_web3'
            this.verifyingColor = 'red--text'
          })
      },
      verifyAccountButtonClickOld () {
        if (this.verifyingAccount === 'need_account') {
          this.$store.dispatch('createShoutSenseAccount')
        } else if (this.verifyingAccount === 'good') {
          this.campaignCreationState = 3
        }
      },
      cancelDialog () {
        this.createCampaignButtonLabel = 'Create It!'
        this.dialog = false
        this.campaignCreationState = 1
        this.creatingCampaign = ''
        this.verifyAccountButtonLabel = 'Verifying...'
        this.verifyingAccount = 'not_started'
      }
    }
  }
</script>
