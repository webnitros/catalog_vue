export const InputSlider = {
    data () {
        return {
            //start: [this.options.start.min, this.options.start.max], // Стартовые значения в слайдере
            connect: true,
            isReset: false,
            behaviour: 'unconstrained-tap',
            options: {
                format: {
                    to: function (value) {
                        return parseInt(value)
                    },
                    from: function (value) {
                        return parseInt(value)
                    }
                }
            },
            changeRanges: false,
            range: this.filter.ranges,
            start: this.filter.start,
            noUiSlider:null
        }
    },
    computed: {

        ranges () {
            let min = this.range[0]
            let max = this.range[1]

            if (this.noUiSlider) {
                // Включаем слайдер если значения различатся
                this.manualDisabled(min !== max)
            }

            // Когда одинаковые значения
            if (min === max) {
                return {
                    'min': [min],
                    'max': [max]
                }
            }
            let ranges = {
                'min': min,
                'max': max
            }

            // Установка области для движения ползунка
            if (this.filter.options.margin && typeof this.filter.options.margin === 'object') {
                this.filter.options.margin.map(function (value) {
                    ranges[value['percent']] = value['from']
                })
                return ranges
            }
            if (max > 20000) {
                ranges['80%'] = 20000
            }
            if (max > 100000) {
                ranges['90%'] = 100000
            }
            return ranges
        },
    },
    methods: {
        /**
         * Сброс
         */
        resetSlider () {
            this.selected = []
            this.isReset = true
            this.noUiSlider.reset()
        },
        /**
         * Сброс
         */
        manualDisabled (disabled) {
            //this.noUiSlider
            if (this.filter.field === 'price') {
                console.log('disabled SLIDER ' + disabled)
                console.log('range MIN ' + this.range[0] + ' MAX ' + this.range[1])
                console.log('start MIN ' + this.start[0] + ' MAX ' + this.start[1])
                console.log('start MIN ' + this.selected[0] + ' MAX ' + this.selected[1])
            }
            /*   var origins = noUiSlider.target.getElementsByClassName('noUi-origin')
               origins[0].setAttribute('disabled', disabled)
               origins[1].setAttribute('disabled', disabled)*/
        },
        /**
         * Сравниваем значения в диапазоне допустих цен чтобы получить нужно ли устанавливать значений или нету
         * @returns {boolean}
         */
        changes () {
            return (this.options.ranges.min !== this.selected[0] || this.options.ranges.max !== this.selected[1])
        },
        updateRange (suggestion, update = true) {

            /*if (this.options.ranges.min === suggestion.min && this.options.ranges.max === suggestion.max) {
                // Не даем обновлять range при одинаковых значениях
                return false
            }*/

            this.options.ranges = suggestion

            if (this.isReset) {
                update = true
            }
            if (!update) {
                //console.log('deferred UPDATE RANGES field '+ this.field)
                // Если значения меньше или больше диапазона то не дает срабатывать изменениям сразу
                // Иначе приводит к повторному запросу
                this.changeRanges = true
            } else {
                let ranges = this.ranges()
                //console.log('UPDATE RANGES: min' + ranges.min +' max '+ ranges.max)
                this.changeRanges = false
                if (this.isReset) {
                    this.noUiSlider.updateOptions({
                        start: [ranges.min, ranges.max],
                        range: ranges
                    })
                } else {
                    this.noUiSlider.updateOptions({
                        range: ranges
                    })
                }
            }

            this.isReset = false

            return true
        },
        handlerInput (input, value) {
            switch (input.classList[0]) {
                case 'slider-input-min':
                    this.$refs.sliderComponent.$el.noUiSlider.set([Number(value), null])
                    break
                case 'slider-input-max':
                    this.$refs.sliderComponent.$el.noUiSlider.set([null, Number(value)])
                    break
                default:
                    break
            }
        },
        inputs (selector) {

            const noUiSlider = this.noUiSlider = this.$refs.sliderComponent.$el.noUiSlider
            const self = this

            // Отклбючаем слайдер если значения равны самому себе
            this.manualDisabled(noUiSlider, this.range[0] === this.range[1])

            // Ищим инпуты для которых будет действовать слайдер
            var inputs = [selector.querySelector('.slider-input-min'), selector.querySelector('.slider-input-max')]

            /**
             * Срабатываем при любом движении
             * используется вместе с input. Без него работать не будет
             */
            noUiSlider.on('update', function (values, handle) {
                inputs[handle].value = values[handle]
            })

            // Listen to keydown events on the input field.
            inputs.forEach(function (input, handle) {

                input.addEventListener('change', function () {
                    self.handlerInput(this, this.value)
                })
                input.addEventListener('keydown', function (e) {
                    var values = noUiSlider.get()
                    var value = Number(values[handle])

                    // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
                    var steps = noUiSlider.steps()

                    // [down, up]
                    var step = steps[handle]
                    var position
                    // 13 is enter,
                    // 38 is key up,
                    // 40 is key down.
                    switch (e.which) {
                        case 13:
                            /// Кнопка работает по умолчанию
                            //self.handlerInput(this, this.value)
                            break
                        case 38:
                            // Get step to go increase slider value (up)
                            position = step[1]
                            // false = no step is set
                            if (position === false) {
                                position = 1
                            }
                            // null = edge of slider
                            if (position !== null) {
                                self.handlerInput(this, value + position)
                            }
                            break

                        case 40:
                            position = step[0]
                            if (position === false) {
                                position = 1
                            }
                            if (position !== null) {
                                self.handlerInput(this, value + position)
                            }
                            break
                    }
                })
            })

        }
    },
    watch: {
        range (newValue, oldValue) {
            //console.log('suggestion')
            //console.log(newValue)
        }
    }
}
