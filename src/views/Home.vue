<template>
  <div class="container">
    <span>Home</span>
    <router-link to="/playground">Go to Playground</router-link>
    <router-link to="/app">Go to Marketplace</router-link>
    <router-link to="/signup" v-if="isAuthenticated != true">Sign Up</router-link>
    <router-link to="/profile" v-else>View Profile {{ twitterScreenname }}</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated () {
      return this.$store.state.auth.isAuthenticated
    },
    twitterScreenname () {
      return this.$store.state.auth.twitterScreenname
    }
  },
  methods: {
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
