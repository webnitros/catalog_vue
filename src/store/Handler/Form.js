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

const HandlerFilters = function ({params}) {

    this.params = params || null

    this.init = function () {

    }

    /**
     * Возвращает выбранные параметры
     */
    this.prepare = function (uri, filtres) {

        let params = this.updateURL(filtres)

        // Записываем параметры в адресную строку
        this.updateRequestURL(uri, params)

        // Запись новых параметров
        //this.updateFilterParams(this.params)



        return params
    }


    /**
     * Возвращает выбранные параметры
     */
    this.updateURL = function (filtres) {
        let params = {}
        Object.keys(filtres).map(function (field, index) {
            let Filter = filtres[field]
            let val = null


            switch (Filter.type) {
                case 'Slider':
                    if (Filter.selected.length > 0) {
                        val = Filter.selected.join(',')
                    }
                    break
                default:
                    if (Filter.selected.length > 0) {
                        val = Filter.selected.join(',')
                    } else {
                        if (Filter.field === 'marker') {
                            params['marker'] = ''
                        }
                    }
                    break
            }
            if (val) {
                params[Filter.field] = val
            }
        })
        return params
    }

    /**
     * Обновление параметров в адресной строке
     * @param uri
     * @param vars
     */
    this.updateRequestURL = function(uri, vars) {
        let oldbrowser = !(window.history && history.pushState)
        var hash = ''
        var i
        for (i in vars) {
            if (vars.hasOwnProperty(i)) {
                hash += '&' + i + '=' + vars[i]
            }
        }
        if (!oldbrowser) {
            if (hash.length !== 0) {
                hash = '?' + hash.substr(1)
                var specialChars = {'%': '%25', '+': '%2B'}
                for (i in specialChars) {
                    if (specialChars.hasOwnProperty(i) && hash.indexOf(i) !== -1) {
                        hash = hash.replace(new RegExp('\\' + i, 'g'), specialChars[i])
                    }
                }
            }

            //var pathname = '/'
            //var pathname = document.location.pathname
            var pathname = uri === '/' ? '/' : uri
            window.history.pushState({mSearch2: pathname + hash}, '', pathname + hash)
        } else {
            window.location.hash = hash.substr(1)
        }
    }

}
module.exports = HandlerFilters
