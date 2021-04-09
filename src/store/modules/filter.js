import client from 'api-client'

const FilterFactory = require('./../factory/index')
const HandlerFactory = require('./../Handler/index')

function updateFilters (commit, getters, response) {
    let filters = {}
    response.map(function (value, index) {
        filters[value.field] = FilterFactory.createFilter(value.type, {
            type: value.type,
            field: value.field,
            options: value.options, //
            search: value.search,
            values: value.values,
            selected: value.selected,
            expand_list: value.expand_list,
            noRank: value.noRank,
        })
        return true
    })
    commit('updateFilters', filters)
}

export default {
    actions: {
        initFilters ({commit, dispatch}, searchParams) {
            commit('setHandler', HandlerFactory.createHandler('Form', {
                params: searchParams,
            }))
            commit('updateSearchParams', searchParams)
            searchParams['build'] = true
            dispatch('fetchProducts', searchParams)
        },

        async fetchProducts ({commit, getters, dispatch}, searchParams = {}) {
            commit('updateLoading', true)
            searchParams['uri'] = searchParams['uri'] ? searchParams['uri'] : document.location.pathname
            client.fetchProducts(searchParams).then((response) => {
                if (!response.success) {
                    alert(response.message)
                    commit('updateLoading', false)
                    return false
                }

                if (typeof ($) !== 'undefined') {
                    // Оповещение события
                    $(document).trigger('mse2_load', response)
                }

                if (response.data.filters) {
                    updateFilters(commit, getters,response.data.filters)
                }

                if (response.data.units) {
                    commit('updateUnits', response.data.units)
                }

                let suggestions = response.data.suggestions || null
                if (suggestions) {
                    commit('updateSuggestions', suggestions)
                }

                if (response.data.elastic) {
                    commit('updateElastic', response.data.elastic)
                }

                if (response.data.results) {
                    commit('updateProducts', response.data.results)
                }

                commit('updateTotal', response.data.total)
                commit('updateLoading', false)
            })
        },

        setURI ({commit}, uri) {
            commit('updateURI', uri)
        },

        submitFilters ({commit, getters, dispatch}) {
            commit('updateLoading', true)

            // Блокируем отправку
            if (!getters.isInitFilers) {
                return false;
            }

            // Обработка наших параметров
            const Handler = getters.getHandler

            let params = Handler.prepare(getters.getUri,getters.allFilters)

            // Обновляем выбранные параметры
            commit('updateFilterParams', params)

            dispatch('fetchProducts', params)

        }
    },
    mutations: {
        updateURI (state, uri) {
            state.uri = uri
        },
        updateInitFilers (state, value) {
            state.initFilers = value
        },
        setHandler (state, handler) {
            state.handler = handler
        },
        updateSearchParams (state, searchParams) {
            state.searchParams = searchParams
        },
        updateFilters (state, filters) {
            state.filters = filters
        },
        updateUnits (state, units) {
            state.units = units
        },

        // Products
        updateProducts (state, filters) {
            state.products = filters
        },
        updateTotal (state, total) {
            state.total = total
        },
        updateLoading (state, loading) {
            state.loading = loading
        },
        updateLimit (state, limit) {
            state.limit = limit
        },
        updateElastic (state, limit) {
            state.elastic = limit
        },

        /**
         * Обновит количество товаров у значений в фильтрах
         * @param state
         * @param suggestions
         */
        updateSuggestions (state, suggestions) {
            Object.keys(state.filters).map(function (filed, index) {
                let filter = state.filters[filed]
                let suggestion = suggestions[filed]
                filter.updateSuggestion(suggestion)
            })
        },

        /**
         * Обновит количество товаров у значений в фильтрах
         * @param state
         * @param params
         */
        updateFilterParams (state, params) {
            state.params = params
        }
    },
    state: {
        units: [],
        handler: null,
        uri: '/',
        initFilers: false,
        elastic: {},
        searchParams: {},
        parent: 6,
        filters: [],
        results: [],
        pagination: [],
        selected: [],

        // Products
        loading: false,
        products: [],
        total: 0,
        limit: 30,
        params: {},
    },
    getters: {
        isInitFilers (state) {
            return state.initFilers
        },
        getHandler (state) {
            return state.handler
        },
        allElastic (state) {
            return state.elastic
        },
        allUnits (state) {
            return state.units
        },
        allFilters (state) {
            let filters = []
            const all = state.filters
            Object.keys(all).map(function (field, index) {
                let Filter = all[field]
                filters.push(Filter)
            })
            return filters
        },
        allParams (state) {
            return state.params
        },
        isSelected (state) {
            return (state.selected.length > 0)
        },
        enableBtnReset (state) {
            return (state.selected.filter(function (item) {
                if (item.field !== 'availability') {
                    return true
                }
            }).length > 0)
        },
        allSearchParams (state) {
            return state.searchParams
        },
        allSortsUnits (state) {
            return state.sorts_units
        },
        allCategories (state) {
            return state.categories
        },

        getUri (state) {
            return state.uri
        },

        allProducts (state) {
            return state.products
        },
        isLoading (state) {
            return state.loading
        },
        totalProducts (state) {
            return state.total
        },
        getLimit (state) {
            return state.limit
        }
    }
}
