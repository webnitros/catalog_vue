import axios from 'axios'

export default {
  actions: {
    async fetchFilters({ commit, getters, dispatch }, limit = 3) {

      await axios('https://jsonplaceholder.typicode.com/posts?_limit='+ limit, {
        method: 'GET'
      }).then((response) => {
        console.log(response.data)
        commit('updateFilters', response.data)
      })

    },
    sayHello() {}
  },
  mutations: {
    updateFilters(state, filters) {
      state.filters = filters
    },
    createPost(state, newPost) {
      state.filters.unshift(newPost)
    }
  },
  state: {
    filters: [],
  },
  getters: {
    allFilters(state) {
      return state.filters
    },
    filtersCount(state, getters) {
      return getters.validFilters.length
    }
  }
}
