<template>
<div class="wrapper">
  <div class="sidebar" data-background-color="white" data-active-color="danger">
    <div class="sidebar-wrapper">
      <div class="logo">
        <a href="#" class="simple-text">
          <img id="logo" src="~@/assets/logo.png" alt="electroneum-logo" width="100">
        </a>
      </div>

      <ul class="nav">
        <li class="active">
          <a href="#">
            <i class="ti-panel"></i>
            <p>Overview</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="ti-arrow-right"></i>
            <p>Send Electroneum</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="ti-view-list-alt"></i>
            <p>Transactions</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="ti-hummer"></i>
            <p>Mining</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <HomeWallet></HomeWallet>
</div>
</template>

<script>
import HomeWallet from './Wallet/HomeWallet';

export default {
  name: 'wallet',
  components: {
    HomeWallet
  },
  data() {
    return {
      walletInfo: {
        filename: '',
        password: ''
      },
      balance: {
        available: 0,
        unavailable: 0
      },
      rank: '',
      height: ''
    }
  },
  methods: {
    notif(text) {
      alert(text)
    },

    open(link) {
      this.$electron.shell.openExternal(link);
    },
    mounted: function() {
      console.log("Ready!")
    }
  }
}
</script>

<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
@import url('../assets/css/paper-dashboard.css');
@import url('https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css');
@import url('../assets/css/animate.min.css');
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>
