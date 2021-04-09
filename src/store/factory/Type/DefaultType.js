const DefaultType = function ({type, options, field, values, expand_list, noRank, selected, search}) {

    if (typeof search !== 'boolean') {
        search = false
    }
    if (typeof expand_list !== 'boolean') {
        expand_list = false
    }

    if (typeof noRank !== 'boolean') {
        noRank = false
    }

    if (typeof selected !== 'object') {
        selected = []
    }

    this.ranges = []
    if (options && options.ranges) {
        this.ranges = options.ranges
    }

    this.start = []
    if (options && options.start) {
        this.start = options.start
    }


    this.events = {}
    this.suggestion = null
    this.type = type || 0
    this.field = field || ''
    this.options = options || {}
    this.values = values || {}
    this.search = search || false
    this.expand_list = expand_list || false
    this.noRank = noRank || false
    this.selected = selected || []

    this.isChange = function () {
        return this.selected.length !== 0
    }

    /**
     * Обновляем количество товаров у значения
     * @param values
     */
    this.updateSuggestion = function (values) {
        this.suggestion = values
        this.fireEvent('suggestion')
    }

    /**
     * Отправка формы
     */
    this.set = function (newValue) {
        this.fireEvent('set')
    }

    /**
     * Вернет выбранные значения
     */
    this.reset = function () {
        this.selected = []
        // Запрещаем отправку формы
        this.fireEvent('reset')
    }

    /**
     * Отправка формы
     */
    this.submit = function () {
        this.fireEvent('submit')
    }

    this.addEvent = function (eventName, callback) {
        this.events[eventName] = callback
    }

    this.fireEvent = function (eventName) {
        let Events = this.events
        const self = this
        Object.keys(Events).forEach(function (targetEvent) {
            var eventType = targetEvent.split('.')[0]
            if (eventName === eventType) {
                //console.log('Event:' + eventName + ' - ' + self.field)
                callback = Events[eventName]
                callback.call(self)
            }
        })
    }
}
module.exports = DefaultType
