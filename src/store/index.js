import Vue from 'vue'
import Vuex from 'vuex'
import actions from '@/store/actions'
import state from '@/store/state'
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import membros from '@/store/modules/membros'
import dizimos from '@/store/modules/dizimos'
import usuarios from '@/store/modules/usuarios'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    membros,
    dizimos,
    usuarios
  },
  state,
  mutations,
  actions,
  getters
})
