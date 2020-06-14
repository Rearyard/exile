import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user:{},
    draftTempData:{},
    isMobile: 0
  },
  mutations: {
    setUserInfo(state,info){
      state.user = info
    },
    clearUserInfo(state){
      state.user = {}
    },
    setDraftTemp(state,info){
      state.draftTempData = info
    },
    clearDraftTemp(state){
      state.draftTempData = {}
    },
    setIsMobile(state, status){
      state.isMobile = status
    }
  },
  actions: {
  },
  modules: {
  }
})
