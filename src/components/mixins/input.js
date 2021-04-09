import { mapActions, mapGetters, mapMutations } from 'vuex'

export const input = {
    props: {
        filter: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            selected: this.filter.selected,
            disabledSubmit: false,
        }
    },
    computed: {
        ...mapGetters(['isLoading', 'getHandler', 'allFilters']),
        show () {
            return this.filter.values.length > 0
        }
    },
    methods: {
        ...mapActions(['submitFilters']),
        ...mapMutations(['updateTopPosition']),
        topPosition (e) {
            this.updateTopPosition(e)
        },
        set (newValue) {
            this.filter.set(newValue)
            this.submit()
        },
        reset () {
            this.selected = []
        },
        submit () {
            if (this.disabledSubmit) {
                this.disabledSubmit = false
                return true
            }
            this.submitFilters()
        },
        /**
         * Сброс filterByName при закрытии контейнера
         */
        openContainer (open_container) {},
        /**
         * Передаем количество выбранных значений в родителя
         */
        setCount (val) {
            this.$emit('count', val.length)
        }
    },
    created () {
        const self = this
        this.filter.addEvent('reset', function () {
            self.reset()
        })
        // Установка значений в фильтры при срабатывание события submit
        this.filter.addEvent('set', function () {
            // Обновляем значение для фильтров
            this.selected = self.selected
        })
        this.setCount(this.selected)
    },
    watch: {
        selected (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.set(newValue)
                this.setCount(newValue)
            }
        }
    }
}
