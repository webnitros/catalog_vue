<template>
    <div class="the_list ps-container">
        <div class="polzun_wrap">
            <veeno
                ref="sliderComponent"
                :behaviour=behaviour
                :handles=getHandles
                :connect=connect
                :range=ranges
                :options=options
                @start="eventStart"
                @set="eventSet"
            />
        </div>
        <div class="polzun_input">
            <div class="polzun_input_el">
                <span class="lab">от</span>
                <input @mousedown="mousedownInput" type="text" value="" class="slider-input-min">
            </div>
            <div class="polzun_input_el">
                <span class="lab">до</span>
                <input @mousedown="mousedownInput" type="text" value="" class="slider-input-max">
            </div>
        </div>
        <hr>
        <!--        <div class="row">
                    <div class="col-md-6">
        <pre>
        Selected  {{ selected }}
        </pre>
                    </div>
                </div>
                <hr>

                <button type="button" @click="setSelected(5500, 45000)">Вставить Selected 5500 до 45000</button>
                <br>
                <button type="button" @click="setRange(1000, 30000)">Вставить Range 1000 до 30000</button>
                <br>
                <button type="button" @click="setRange(0, 1696125)">Вставить Range 0 до 1696125</button>
                <br>
                <button type="button" @click="reset()">Сброс в дефолтное состояние</button>
                <br>-->
    </div>
</template>

<script>
import { input } from '../mixins/input'
import { InputSlider } from '../mixins/InputSlider'
import veeno from 'veeno'

export default {
    name: 'TypeSlider',
    components: {
        veeno,
    },
    mixins: [input, InputSlider],
    data () {
        return {
            isReset: false,
            isChangeRange: false,
            stopHandle: false,
            selected: [],
        }
    },
    computed: {
        /**
         * Установка ручек от и до
         */
        getHandles () {
            return this.start
        }
    },
    methods: {
        /* debug */
        setSelected (min, max) {
            // Если дергаем обе ручки то запись нужна только на второй ручке
            this.stopHandle = true

            let selected = [min, max]
            if (this.changeRangeFromHandleSelected(selected, this.range)) {
                if (selected[0] < this.start[0]) {
                    selected[0] = this.start[0]
                }
                if (selected[1] > this.start[1]) {
                    selected[1] = this.start[1]
                }
            }
            this.$refs.sliderComponent.$el.noUiSlider.set(selected)
        },

        reset () {

            // Сбрасываем все в дефолтное состояние которые было при входе на страницу
            this.range = this.filter.options.ranges
            this.start = this.range

            this.isChangeRange = true // Говорим что изменения у selected производить не нужно так как мы сами это сделаем
            this.selected = []
            this.isReset = true

            //this.selected = [] // Устанавливаем что ничего не выбрано
            this.runChangeRange()

        },

        /**
         * Нажатие в область input вызовет изменения если перед этим был вызван отложенный диапазон
         */
        mousedownInput () {
            if (this.isChangeRange) {
                this.isChangeRange = false
                // Меняем диапазон при косании ручки
                this.runChangeRange()
            }
        },
        runChangeRange () {
            let params = {
                start: this.start,
                range: this.ranges
            }
            this.$refs.sliderComponent.$el.noUiSlider.updateOptions(params)
        },
        eventStart (Slider) {
            console.log('EVENT:SLIDER - START')


            if (this.isChangeRange) {
                // Меняем диапазон при косании ручки
                this.runChangeRange()
            }
        },
        eventSet (Slider) {
            if (this.stopHandle) {
                // Снямаем блокировку со второй ручки
                this.stopHandle = false
                return true
            }

            console.log('EVENT:SLIDER - SET')

            this.change = false

            let values = Slider.values

            // 1. новое значение равно значение в сладе
            if (this.selected === values) {
                //console.log('NOT UPDATE selected')
                return true
            }

            // Не пишем если значение одинаковые
            let isUpdateSelected = true

            // Запрещаем установку значения в случае если ручки дернули за счет изменения диапазона

            if (this.isChangeRange) {
                //console.log('isChangeRange TRUE')
                isUpdateSelected = false
            }

            if (isUpdateSelected) {
                // Если была попытка обновить значения во время сброса
                if (this.isReset) {
                    //console.log('UPDATE isReset ')
                    this.isReset = false
                    return false
                }
                //console.log('UPDATE SELECTED MIN '+ values[0] + ' MAX '+ values[1])
                //console.log('rangeIs '+ this.rangeIs(values))

                if (this.rangeDefaultIs(values)) {
                    //console.log('rangeDefaultIs '+ this.rangeDefaultIs(values))
                    values = [] // сбрасываем значение так как оно равно диапазону по умолчанию
                }

                if (values[0] === 0 && values[1] === 0) {
                    values = []
                }

                // Любые NaN не пропускаем
                if (isNaN(values[0]) || isNaN(values[1])) {
                    values = []
                }

                if (this.selected.length === 0 && values.length === 0) {
                    return false
                }

                if (values === this.selected) {
                    // Одинаковые значения не вызывают submit
                    return false
                }

                this.selected = values
            }
            this.isChangeRange = false
        },

        /**
         * Вернет true когда разрешено менять диапазон при касании ручки
         */
        changeRangeFromHandle () {
            if (!this.selectedIsChange()) {
                return false
            }
            return this.changeRangeFromHandleSelected(this.selected, this.range)
        },

        /**
         * Вернет true когда разрешено менять диапазон при касании ручки
         */
        changeRangeFromHandleSelected (selected, range) {
            return selected[0] < range[0] || selected[1] > range[1]
        },
        /**
         * Вернет true если есть изменения
         */
        selectedIsChange () {
            return this.selected.length > 0
        },
        /**
         * Установка диапазона цен
         * @param min
         * @param max
         * @returns {boolean}
         */
        setRange (min, max) {
            // Если дергаем обе ручки то запись нужна только на второй ручке

            this.stopHandle = true // Пропускаем установку из первой ручки
            this.isChangeRange = true // Говорим что мы меняем диапазон

            this.start = this.range = [min, max]

            if (this.selectedIsChange() && !this.changeRangeFromHandle()) {
                this.start = this.selected
                //console.log('UPDATE START to SELECTED TRUE')
            }

            // Если выбрано значение то проверяем как нам установить диапазон
            if (this.changeRangeFromHandle()) {
                // Указываем что стартовые позиции будут выбранные значения
                this.start = this.selected
                //console.log('changeRangeFromHandle TRUE')
                return true
            }
            this.runChangeRange()
        },

        /**
         * Проверяем что диапазон равен выбранному значению
         */
        rangeIs (values) {
            return values[0] === this.range[0] && values[1] === this.range[1]
        },
        /**
         * Проверяем что диапазон равен выбранному значению
         */
        rangeDefaultIs (values) {
            return values[0] === this.filter.options.defaultBucket[0] && values[1] === this.filter.options.defaultBucket[1]
        },
    },
    mounted () {
        if (!this.rangeDefaultIs(this.filter.selected)) {
            // TODO ВРОД ПОПРАВИЛ проверка связана с классом core/src/ElasticFilter/Filters/Slider.php diffAggregations 54
            // Возможна не правильная работа так как при выбранном значении возвращаются результаты по умолчанию
            this.disabledSubmit = true
            this.selected = this.filter.selected
        }

        this.inputs(this.$el)
    },
    created () {
        const self = this

        // Установка значений в фильтры при срабатывание события submit
        this.filter.addEvent('suggestion', function () {
            // Обновляем значение для фильтров
            if (!self.rangeIs([this.suggestion.min, this.suggestion.max])) {
                self.setRange(this.suggestion.min, this.suggestion.max)
            }

        })
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noUi-horizontal {
    height: 5px !important;
}
</style>
