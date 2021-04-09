<template>
    <div class="the_list">
        <div class="the_search" v-if="isSearch">
            <input type="text" v-model="filterByName" placeholder="Я ищу...">
        </div>
        <div class="check_wrap">
            <vue-custom-scrollbar class="scroll-area" :settings="settings">
                <div class="unit_container" v-if="show">
                    <div class="apply_filters" v-for="(row,index) in iterations" :key="row.value">
                        <input type="checkbox" class="checkbox" :id=filter.field+index @input="topPosition" :value="row.value" :disabled="row.count === 0" v-model="selected">
                        <label class="customcheck" v-bind:class="{'no_cat' : row.count === 0}" :for=filter.field+index>
                            <span class="checkmark"></span>
                            <span class="the_tit">{{ row.label }}</span>
                            <span class="val">{{ row.count }}</span>
                        </label>
                    </div>
                    <small class="is_empty" v-if="iterations.length === 0">По вашему запросу <b>{{filterByName}}</b> ничего не найдено</small>
                </div>
                <div v-else>К сожалению ничего не найдено</div>
            </vue-custom-scrollbar>
        </div>
    </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import { input } from '../mixins/input'
import { mapGetters } from 'vuex'

export default {
    name: 'TypeCheckbox',
    mixins: [input],
    components: {
        vueCustomScrollbar
    },
    data () {
        return {
            settings: {
                suppressScrollY: false,
                suppressScrollX: false,
                wheelPropagation: !this.filter.expand_list,   // Включает скролирование внутри блока
            },
            filterByName: '',
            noRank: this.filter.noRank,
            values: this.filter.values,
        }
    },
    computed: {
        ...mapGetters(['isLoading']),
        iterations () {
            let values = this.filter.values
            if (!values) {
                return {}
            }
            if (this.filter.suggestion) {
                const suggestion = this.filter.suggestion
                values.map(function (val) {
                    let count = 0
                    if (suggestion) {
                        count = suggestion[val.value] || 0
                    }
                    val.count = count
                })
            }
            return values.filter(this.filtersValue)
        },
        isSearch () {
            return (this.filter.search && this.filter.values.length > 3)
        },
        count () {
            return this.filter.values.length
        }
    },
    methods: {

        /**
         * Сброс filterByName при закрытии контенера
         */
        openContainer (open_container) {
            if (!open_container) {
                this.filterByName = '' // стираем иначе плохо выглядит
            }
        },

        /**
         * Сортировка по ключу sort
         */
        defaultSort: function (a, b) {
            return Number(a.sort)
        },

        /**
         * Сортировка по выбранным значениям
         */
        sortSelected (a, b) {
            if (this.selected.findIndex(item => item === a.value) !== -1) {
                return -1
            }
            return 0 + a.sort
        },
        /**
         * Фильтр для отбора по наименованию
         * @param value
         * @returns {boolean}
         */
        filtersValue: function (value) {
            if (this.filterByName.length === 0) {
                return true
            }
            let label = value.label.toString().toLowerCase()
            return (label.indexOf(this.filterByName.toLowerCase()) > -1 || label.indexOf(this.filterByName.translit().toLowerCase()) > -1 || label.indexOf(this.filterByName.translitBack().toLowerCase()) > -1)
        },
    },
    created () {
        // Если установлено то раскрываем весь блок
        if (this.values.length > 0) {
            this.values.sort(this.defaultSort)
            if (!this.noRank) {
                this.values.sort(this.sortSelected)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.is_empty {
    font-style: italic;
}
.check_wrap {
    max-height: none !important;
}
</style>
