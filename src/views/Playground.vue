<template>
  <div class="container">
    <div class="logo">
      <img src="../assets/logo.png" alt="" />
    </div>
    <h1>ShoutSense</h1>
    <span>ShoutSense is the only social advertising platform where users are in control.</span>
    <span>&nbsp;</span>
    <div class="text-xs-center">
      <v-select
        @change="updateSelectOptions"
        v-bind:items="availableEthereumAddresses"
        v-model="selectedAddress"
        label="Select Funding Ethereum Address"
        class="input-group--focused"
        item-value="text"
      ></v-select>
      <v-btn round primary dark v-on:click="testTransaction">Test Transactions</v-btn>
      <v-btn round primary dark>Rounded Button 2</v-btn>
      <span>&nbsp;</span>
      <span>{{ testTransactionId }}</span>
      <span>{{ currentBlock }}</span>
    </div>

    <div class="waffle">
      <div class="waffle-piece">
        <p>For Advertisers</p>
        <p>Get your word out!</p>
        <p><a href="https://vuejs.org/v2/guide/">Learn More</a></p>
      </div>
      <div class="waffle-piece">
        <p>For Twitter Users</p>
        <p>Learn how to promote topics interesting to you, while making money.</p>
        <p><a href="https://router.vuejs.org/">Learn More</a></p>
      </div>
      <div class="waffle-piece">
        <p>About ShoutSense</p>
        <p>Learn all about the ShoutSense Twitter-based advertising platform</p>
        <p><a href="http://vuex.vuejs.org/en/">About</a></p>
      </div>
      <div class="waffle-piece">
        <p>FAQ</p>
        <p>Life, the Universe, and Everything...</p>
        <p><a href="https://github.com/mzabriskie/axios/">FAQ</a></p>
      </div>
      <div class="waffle-piece">
        <p>Vue</p>
        <p>Intuitive, Fast and Composable MVVM for building interactive interfaces.</p>
        <p><a href="https://vuejs.org/v2/guide/">Docs</a></p>
      </div>
      <div class="waffle-piece">
        <p>Vue Router</p>
        <p>The official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze.</p>
        <p><a href="https://router.vuejs.org/">Docs</a></p>
      </div>
      <div class="waffle-piece">
        <p>Vuex</p>
        <p>Cendivalized State Management for Vue.js.</p>
        <p><a href="http://vuex.vuejs.org/en/">Docs</a></p>
      </div>
      <div class="waffle-piece">
        <p>Axios</p>
        <p>Promise based HTTP client for the browser and node.js</p>
        <p><a href="https://github.com/mzabriskie/axios/">Docs</a></p>
      </div>
      <div class="waffle-piece">
        <p>Stylus</p>
        <p>An innovative stylesheet language that compiles down to CSS.</p>
        <p><a href="http://stylus-lang.com/">Docs</a></p>
      </div>
      <div class="waffle-piece">
        <p>LostGrid</p>
        <p>A powerful grid system built in PostCSS that works with any preprocessor and even vanilla CSS.</p>
        <p><a href="http://stylus-lang.com/">Docs</a></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      selectedAddress: '',
      testTransactionId: '(none)'
    }
  },
  mounted () {
    this.$store.dispatch('monitorEthereumAddresses')
  },
  computed: {
    availableEthereumAddresses () {
      return this.$store.state.blockchain.availableEthereumAddresses
    },
    currentBlock () {
      return this.$store.state.blockchain.currentBlock
    }
  },
  methods: {
    testTransaction: function (event) {
      this.$store.dispatch('testTransaction', this.selectedAddress)
        .then((transactionId) => {
          console.log('transaction result: ' + transactionId)
          this.testTransactionId = transactionId
        })
        .catch((error) => {
          console.error('transaction error: ' + error)
        })
    },
    updateSelectOptions: function (event) {
      const select = event.target
      if (select) {
        this.$emit('change', select.options[select.selectedIndex].value)
      }
    }
  }
}
</script>

<style lang="stylus">
.container
  lost-center 980px
  padding 30px
  text-align center
.waffle
  margin-top 50px
  height 100%
.waffle-piece
  lost-waffle 1/1
  border-radius 10px
  height 250px
  background #607D8B
  color white
  display flex
  flex-direction column
  justify-content space-between
  align-items center
  @media(min-width 480px)
    lost-waffle 1/2
    height 250px
  p
    padding 5px
    &:first-child
      font-size 18px
      letter-spacing 0.1px
      font-weight 600
  p
    &:last-child
      align-self flex-middle
      width 100%
  a
    color white
    font-weight 600
    text-decoration none
    &:before
      content '> '
.logo
  width 100px
  margin 0 auto
  img
    max-width 100%
    margin 0 auto
h1
  font-size 1.3em
  margin-bottom 0.3rem
  font-weight normal
  background #29abe2
  color white
  padding 5px 0
  border-radius 5px
span
  display block
  color #607D8B
  font-size 18px
</style>
