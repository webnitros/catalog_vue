import axios from 'axios'

export default {
  actions: {
    async fetchPosts({ commit, getters, dispatch }, limit = 3) {

      await axios('https://jsonplaceholder.typicode.com/posts?_limit='+ limit, {
        method: 'GET'
      }).then((response) => {
        console.log(response.data)
        commit('updatePosts', response.data)
      })

    },
    sayHello() {}
  },
  mutations: {
    updatePosts(state, posts) {
      state.posts = posts
    },
    createPost(state, newPost) {
      state.posts.unshift(newPost)
    }
  },
  state: {
    posts: []
  },
  getters: {
    validPosts(state) {
      return state.posts.filter(p => {
        return p.title && p.body
      })
    },
    allPosts(state) {
      return state.posts
    },
    postsCount(state, getters) {
      return getters.validPosts.length
    }
  }
}
