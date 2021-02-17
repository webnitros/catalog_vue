import Vue from 'vue'
import Vuex from 'vuex'
import post from './modules/post'
import filter from './modules/filter'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    post,
    filter,
  }
})
