<template>
  <v-app>
    <v-navigation-drawer>
      <span>nav3</span>
    </v-navigation-drawer>
    <v-toolbar></v-toolbar>
    <main>
      <v-container fluid>
        create campaign
        <span>&nbsp;</span>

        <v-flex xs12 sm6 offset-sm3>

          <v-card class="grey lighten-4 elevation-0">
            <v-card-text>
              <v-container fluid>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      name="input-7-1"
                      v-model="tweetText"
                      label="Tweet Text"
                      :counter="160"
                      multi-line
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn @click="createCampaign">Next</v-btn>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </main>
    <v-footer>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        anonymous: false,
        startDate: null,
        endDate: null,
        maxSpend: 0.05,
        shoutBounty: 0.0001,
        tweetText: '#ShoutsenseNow'
      }
    },
    methods: {
      createCampaign () {
        let campaign = {}
        campaign.is_anonymous = this.anonymous
        campaign.start_date = this.startDate
        campaign.end_date = this.endDate
        campaign.max_spend = this.maxSpend
        campaign.shout_bounty = this.shoutBounty
        campaign.tweet_text = this.tweetText
        console.log('create campaign with ' + JSON.stringify(campaign))
        this.$store.dispatch('createCampaign', campaign)
      }
    }
  }
</script>
