import Vue from 'vue'
import store from './store'
import App from './App.vue'
import 'babel-polyfill'
import Multiselect from 'vue-multiselect'
import VueScrollTo from 'vue-scrollto'

// register globally
Vue.component('multiselect', Multiselect)
Vue.config.productionTip = false

String.prototype.translit = String.prototype.translit || function () {
  let str = this
  let replace = ''
  let replacer = {
    'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г',
    'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы',
    'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
    ';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
    'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю', '/': '.'
  }
  for (let i = 0; i < str.length; i++) {
    if (replacer[str[i].toLowerCase()] != undefined) {
      if (str[i] == str[i].toLowerCase()) {
        replace = replacer[str[i].toLowerCase()]
      } else if (str[i] == str[i].toUpperCase()) {
        replace = replacer[str[i].toLowerCase()].toUpperCase()
      }
      str = str.replace(str[i], replace)
    }
  }
  return str
}

Vue.directive("filter", {
  bind: function(el, binding) {
    this.inputHandler = function(e) {
      var ch = String.fromCharCode(e.which);
      var re = new RegExp(binding.value);
      if (!ch.match(re)) {
        e.preventDefault();
      }
    };
    el.addEventListener("keypress", this.inputHandler);
  },
  unbind: function(el) {
    el.removeEventListener("keypress", this.inputHandler);
  },
  inputHandler: null
});


Vue.use(VueScrollTo)

// You can also pass in the default options
Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})

new Vue({
  components: { Multiselect },
  el: '#app',
  store,
  render: h => h(App)
})
