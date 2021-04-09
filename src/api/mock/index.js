import axios from 'axios'


export default {
    fetchFilters (params) {
        var myJsonString = JSON.stringify(params)
        return axios
            .get('https://dev1.fandeco.ru/rest/vue/filters?request=' + myJsonString)
            .then(response => response.data)
    },
    fetchProducts (params) {
        var myJsonString = JSON.stringify(params)
        return axios
            .get('https://dev1.fandeco.ru/rest/vue/products?request=' + myJsonString)
            .then(response => response.data)
    }
}

/*
import filters from './data/filters'
import products from './data/products'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchFilters () {
    return fetch(filters, 1000) // wait 1s before returning resorts
  },
  fetchProducts () {
    return fetch(products, 1000) // wait 1s before returning resorts
  }
}
*/
