import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import VueCropper from 'vue-cropper'

Vue.config.productionTip = false
Vue.use(VueCropper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
