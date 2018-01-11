import Vue from 'vue'
import axios from 'axios'

import App from './App'
import store from './store'
import router from './router'
import VueProgressBar from 'vue-progressbar'

Vue.config.productionTip = false

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '5px',
  thickness: '15px'
})

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
