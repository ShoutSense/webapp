<template>
  <div class="container">
    <span>This screen conveys that both advertisers and publishers sign up using their twitter account</span>
    <span>&nbsp;</span>
    <v-btn round primary large v-on:click="signUp" v-if="isAuthenticated != true">Signup with Twitter</v-btn>
    <v-btn round primary large v-on:click="signOut" v-else>SignOut as {{ twitterScreenname }}</v-btn>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.auth.isAuthenticated
    },
    twitterAccessToken () {
      return this.$store.state.auth.twitterAccessToken
    },
    twitterScreenname () {
      return this.$store.state.auth.twitterScreenname
    }
  },
  methods: {
    signUp: function (event) {
      console.log('signup clicked')
      this.$store.dispatch('authenticateAll')
    },
    signOut: function (event) {
      console.log('signout clicked')
      this.$store.dispatch('signout')
    }
  }
}
</script>

<style lang="stylus">
.container
  lost-center 980px
  padding 30px
  text-align center
span
  display block
  color #607D8B
  font-size 18px
</style>
