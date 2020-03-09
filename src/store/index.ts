import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchData:""
  },
  mutations: {
    changeSearchData(state,str){
      state.searchData = str;
    }
  },
  actions: {
  },
  modules: {
  }
})
