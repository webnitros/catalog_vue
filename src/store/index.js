import Vue from 'vue'
import Vuex from 'vuex'
import filter from './modules/filter'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        filter
    },
    state: {
        topPosition: 0,
        applyFilters: false,
    },
    mutations: {
        updateTopPosition (state, el) {
            let value = el.target.getBoundingClientRect().top
            let main_filters = document.getElementById('ms2_form')
            let button = document.getElementById('apply-filters-float-btn')
            let parentTop = main_filters.getBoundingClientRect().top
            state.topPosition = value - parentTop - button.clientHeight / 2 + 20
        }
    },
    getters: {
        getTopPosition (state) {
            return state.topPosition
        },
        applyFilters (state) {
            return state.applyFilters
        }
    }
})
