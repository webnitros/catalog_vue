import axios from 'axios'

const fetch = (mockData, time = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData)
        }, time)
    })
}

export default {
    fetchFilters () {
        return axios
            .get('https://dev1.fandeco.ru/rest/vue/filters')
            .then(response => response.data)
    },
    fetchProducts (params) {
        var myJsonString = JSON.stringify(params)

        if (params.build && window.fdkCatalog) {
            // Грузим фильтры при входе на страницу не из ajax а сразу из конфига построенного на json
            return fetch(window.fdkCatalog)
        }

        return axios
            .get('https://dev1.fandeco.ru/rest/vue/products?request=' + myJsonString)
            .then(response => response.data)
    }
}
