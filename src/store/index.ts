import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import {
  Article,
} from "@/types/api/article";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user:{},
    searchData:{} as Article.Search.Request
  },
  mutations: {
    changeSearchData(state, req: Article.Search.Request){
      state.searchData = req;
    },
    setUserInfo(state,info){
      state.user = info
    },
    clearUserInfo(state){
      state.user = {}
    },
  },
  actions: {
  },
  modules: {
  }
})
