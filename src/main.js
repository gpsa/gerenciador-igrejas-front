// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueTheMask from 'vue-the-mask'

// import config from '@/config'
import 'vuetify/dist/vuetify.css'
import App from './App'
import store from './store/index'
import config from './config'
import VeeValidate from 'vee-validate'

// Traduções
import i18n from './i18n/index'

// Filtros
import {} from '@/filters'

// Router
import router from './router'

Vue.config.productionTip = false

Vue.use(VeeValidate, {locale: config.locale})
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueTheMask)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: {App},
  created () {
    this.$store.dispatch('checkAuth')
  }
})
