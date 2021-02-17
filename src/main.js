import Vue from 'vue'
import store from './store'
import App from './App.vue'
import 'babel-polyfill'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
