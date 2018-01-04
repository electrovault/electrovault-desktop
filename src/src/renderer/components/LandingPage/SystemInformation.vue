<template>
  <div>
    <div class="title">System Information</div>
    <div class="items">
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform }}</div>
      </div>
      <div class="item">
        <div class="name">Hostname:</div>
        <div class="value">{{ hostname }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        platform: require('os').platform(),
        hostname: require('os').hostname(),
      }
    }
  }
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
