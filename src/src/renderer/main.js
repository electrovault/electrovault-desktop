import Vue from 'vue'
import axios from 'axios'

import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
