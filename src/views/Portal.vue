<template>
  <v-app toolbar>
    <v-navigation-drawer
      temporary
      v-model="navigatonDrawer"
      light
      overflow
      absolute>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="twitterAvatarUrl" alt="">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ twitterScreenname }}</v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" v-on:click="optionClicked(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      right
      light
      persistent
      floating
      class="transparent"
      disable-route-watcher
      v-model="statusDrawer">
      <blockchain-status-card></blockchain-status-card>
    </v-navigation-drawer>
    <v-toolbar fixed class="indigo lighten-1" dark>
      <v-toolbar-side-icon
        @click.stop="navigatonDrawer = !navigatonDrawer">
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <v-avatar size="36px">
          <img :src="twitterAvatarUrl" alt="">
        </v-avatar>
        {{ twitterScreenname }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon
        @click.stop="statusDrawer = !statusDrawer"
        v-show="viewingAdvertiserPage || viewingPublisherPage">
        <v-icon
          dark medium
          :class="determineStatusColor">
          fa-power-off
        </v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
        <v-snackbar warning bottom v-model="showWarningSnackbarDialog">
          {{ snackbarWarningMessage }}
          <v-btn dark flat @click.native="hideWarningSnackbar">Ok</v-btn>
        </v-snackbar>
        <v-snackbar error bottom v-model="showErrorSnackbarDialog">
          {{ snackbarErrorMessage }}
          <v-btn dark flat @click.native="hideErrorSnackbar">Ok</v-btn>
        </v-snackbar>
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
      width: 600,
      navigatonDrawer: false,
      statusDrawer: false,
      items: [
        { title: 'Marketplace', icon: 'question_answer', path: '/app' },
        { title: 'Advertiser Dashboard', icon: 'dashboard', path: '/app/advertiser' },
        { title: 'Publisher Dashboard', icon: 'question_answer', path: '/app/publisher' }
      ]
    }
  },
  computed: {
    determineStatusColor () {
      let red = 'red--text'
      if (!this.connectedToNetwork()) {
        return red
      } else if (!this.shoutsenseAvailable()) {
        this.statusDrawer = true
        return red
      }
      let yellow = 'yellow--text'
      if (this.viewingPublisherPage() && !this.publisherAccountAvailable()) {
        this.statusDrawer = true
        return yellow
      } else if (this.viewingAdvertiserPage() && !this.advertiserAccountValidated()) {
        this.statusDrawer = true
        return yellow
      }
      if (this.statusDrawer) {
        setTimeout(() => {
          this.statusDrawer = false
        }, 5000)
      }
      return 'green--text'
    },
    twitterScreenname () {
      return this.$store.state.auth.twitterScreenname
    },
    snackbarErrorMessage () {
      return this.$store.state.ui.snackbarErrorMessage
    },
    snackbarWarningMessage () {
      return this.$store.state.ui.snackbarWarningMessage
    },
    twitterAvatarUrl () {
      return 'https://twitter.com/' + this.twitterScreenname + '/profile_image?size=mini'
    },
    showErrorSnackbarDialog: {
      get: function () {
        return this.$store.state.ui.showErrorSnackbarDialog
      },
      set: function (showIt) {
        if (!showIt) {
          this.$store.dispatch('hideErrorSnackbar')
        } // don't show it here, since no message was provided
      }
    },
    showWarningSnackbarDialog: {
      get: function () {
        return this.$store.state.ui.showWarningSnackbarDialog
      },
      set: function (showIt) {
        if (!showIt) {
          this.$store.dispatch('hideWarningSnackbar')
        } // don't show it here, since no message was provided
      }
    }
  },
  methods: {
    optionClicked (item) {
      this.$router.push(item.path)
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
    advertiserAccountValidated () {
      return this.$store.state.auth.advertiserAccountValidated
    },
    viewingPublisherPage () {
      return this.$store.state.route.path === '/app/publisher'
    },
    viewingAdvertiserPage () {
      return this.$store.state.route.path === '/app/advertiser'
    },
    hideErrorSnackbar () {
      this.$store.dispatch('hideErrorSnackbar')
    },
    hideWarningSnackbar () {
      this.$store.dispatch('hideWarningSnackbar')
    }
  }
}
</script>
