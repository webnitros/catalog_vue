import Vue from 'vue'
import Vuex from 'vuex'
import filter from './modules/filter'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    filter,
    products,
  },
  state: {
    topPosition: 0
  },
  mutations: {
    updateTopPosition (state, value) {
      let main_filters = document.getElementById('ms2_form');
      let button = document.getElementById('apply-filters-float-btn');
      let parentTop = main_filters.getBoundingClientRect().top
      state.topPosition = value - parentTop - button.clientHeight / 2 + 20
    }
  },
  getters: {
    getTopPosition (state) {
      return state.topPosition
    }
  }
})
