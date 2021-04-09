<template>
    <!--  checkbox  -->
    <div>
        <p class="js_open_list" v-bind:class="{'active': isOpenContainer }" v-if="!hideLabel">
              <span class="js_open_list_tit" v-bind:class="{'active' : isReset}" @click="openContainer">
              {{ unit.label }}
<!--                  <i v-if="isReset && showCount">{{ countSelected }}</i>-->
              </span>
            <button type="button" role="button" class="js_reset" v-if="isReset" @click="reset">
                Сбросить
            </button>
        </p>

        <div v-bind:class="{'active': isOpenContainer }" v-show="isOpenContainer">
            <keep-alive v-if="isCreated">
                <component ref="childComponent" v-bind:is="dynamicComponentLoading" :filter="filter" @count="setCount"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import 'vue-custom-scrollbar/dist/vueScrollbar.css'
import TypeSlider from './Row/Slider'
import TypeCheckbox from './Row/Checkbox'
import { mapGetters } from 'vuex'

export default {
    name: 'RowUnit',
    components: {
        TypeCheckbox,
        TypeSlider
    },
    props: {
        unit: {
            type: Object,
            default: {},
        }
    },
    data () {
        return {
            count: 0,
            created: this.unit.created,
            open_container: this.unit.open_container
        }
    },
    computed: {
        ...mapGetters(['allFilters']),
        /**
         * Динамическая загрузка компонента
         * @returns {string}
         */
        dynamicComponentLoading () {
            return 'type-' + this.unit.type.toLowerCase()
        },
        countSelected () {
            return this.count
        },
        filter () {
            let index = this.allFilters.findIndex(item => item.field === this.unit.field)
            return this.allFilters[index]
        },
        isOpenContainer () {
            return this.open_container
        },
        hideLabel () {
            return this.unit.hide_label
        },
        isCreated () {
            return this.created
        },
        showCount () {
            return this.unit.type !== 'Slider'
        },
        isReset () {
            return this.count > 0
        },
    },
    methods: {
        /**
         * Сброс по нажатию на кнопку Сбросить
         */
        openContainer () {
            this.open_container = !this.open_container
            if (!this.created && this.open_container) {
                this.created = true
            }

            this.childOpenContainer()
        },
        childOpenContainer: function () {
            if (this.$refs.childComponent) {
                this.$refs.childComponent.openContainer(this.open_container)
            } else {
                const self = this
                setTimeout(function () {
                    self.$refs.childComponent.openContainer(self.open_container)
                }, 300)
            }
        },
        reset: function () {
            this.$refs.childComponent.reset()
        },
        setCount: function (count) {
            this.count = count
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active .the_list {
    display: block !important;
}

.js_reset {
    display: block !important;
}
</style>
