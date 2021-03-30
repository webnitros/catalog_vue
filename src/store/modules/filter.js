import client from 'api-client'


function escapeHtml (string) {
  let i = 0
  var specialChars = {'%': '%25', '+': '%2B', '%252C': ',', '%252B': ' ', '%2B': ' '}
  for (i in specialChars) {
    if (specialChars.hasOwnProperty(i) && string.indexOf(i) !== -1) {
      string = string.replace(new RegExp('\\' + i, 'g'), specialChars[i])
    }
  }
  return string
}

export default {
  actions: {
    initFilters ({commit}, searchParams) {
      commit('updateSearchParams', searchParams)
    },
    async fetchFilters ({commit, getters, dispatch}) {
      client.fetchFilters().then((response) => {
        let ranks = {}
        response.map(function (value, index) {
          value.rank = index
          ranks[value.field] = value.rank
          if (!value.open) {
            value.open = false
          }
          if (value.show_three) {
            value.open = true
          }
          return value
        })
        commit('updateRanks', ranks)
        commit('updateFilters', response)
        commit('updateFilterSelected', getters.allSearchParams)
        commit('rankFilters') // Сортировка фильтров при входе на страницу
      })
    },
    async fetchSuggestions ({commit, getters, dispatch}, searchParams) {
      client.fetchSuggestions().then((response) => {
        commit('updateSuggestions', response)
      })
    },
    fetchSelected ({commit, state, getters, dispatch}, field) {
      const index = state.selected.findIndex(item => item.field === field)
      if (index !== -1) {
        return state.selected[index].selected
      }
      return []
    },
  },
  mutations: {
    // Меняем порядок фильтров после нажатия на кнопку показать
    rankFilters (state) {
      let filters = state.filters.map(function (value) {
        const rank = state.ranks[value.field]
        if (value.noRank) {
          value.rank = rank
        } else {
          if (state.selected.findIndex(item => item.field === value.field) !== -1) {
            value.rank = 4
          } else {
            value.rank = rank
          }
        }
        return value
      })
      state.filters = filters
    },
    updateSearchParams (state, searchParams) {
      if (Object.keys(searchParams).length === 0) {
        searchParams = state.resetParams.data
      }
      state.searchParams = searchParams
    },
    updateRanks (state, ranks) {
      state.ranks = ranks
    },
    updateFilters (state, filters) {
      state.filters = filters
    },
    updateSuggestions (state, filters) {
      state.suggestions = filters
    },
    updateSelected (state, data) {
      let selected = state.selected
      const index = selected.findIndex(item => item.field === data.field)
      if (index !== -1) {
        if (data.selected.length === 0) {
          selected = selected.filter(item => item.field !== data.field)
        } else {
          selected[index]['selected'] = data.selected
        }
      } else {
        selected.push({
          field: data.field,
          selected: data.selected,
        })
      }
      state.selected = selected
    },
    updateFilterOption (state, data) {
      state.filters.map(function (value, key) {
        if (data.all || data.field === value.field) {
          value[data.key] = data.value
        }
      })
    },
    updateFilterSelected (state, searchParams) {

      let params = []
      state.filters.map(function (value, key) {
        let values = searchParams[value['field']]
        if (values) {
          let selected = []
          let tmp = escapeHtml(values)
          tmp = tmp.split(',')
          let type = value['type']
          switch (type) {
            case 'slider':
            case 'boolean':
              selected = tmp.map(function (val) {
                return parseInt(val)
              })
              break
            default:
              selected = tmp
              break
          }

          // При первой иниализации заполням значения по умолчанию
          if (!state.initFilers) {
            var valuesDefault = selected.map(function (val) {
              return val
            })
            state.selectedDefault.push({
              field: value['field'],
              selected: valuesDefault
            })
          }
          params.push({
            field: value['field'],
            selected: selected
          })
        }
      })
      state.selected = params
      if (!state.initFilers) {
        state.initFilers = true
      }
    }
  },
  state: {
    initFilers: false,
    searchParams: {},
    suggestions: {},
    filters: [],
    results: [],
    pagination: [],
    ranks: {},
    sort: 0,
    selected: [],
    selectedDefault: [],
    resetParams: {
      data: {
        availability: '1'
      }
    },
    limit: 0,
  },
  getters: {
    allSuggestions (state) {
      return state.suggestions
    },
    allFilters (state) {
      return state.filters
    },
    allSelected (state) {
      return state.selected
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
    allSelectedDefault (state) {
      return state.selectedDefault
    },
    allSearchParams (state) {
      return state.searchParams
    },
    allResetParams (state) {
      return state.resetParams.data
    },
    filtersCount (state, getters) {
      return getters.validFilters.length
    }
  }
}
