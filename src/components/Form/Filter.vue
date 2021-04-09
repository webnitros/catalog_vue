<template>
    <form class="listing_filters_element apply_filters_outer" id="ms2_form">
        <div class="clean_filters" @click="reset" v-if="enableBtnReset">
            <button class="btn">Очистить фильтр</button>
            <button type="submit" class="btn btn_orange">Показать ХХХХ шт.</button>
        </div>
        <div class="unit unit_active">
            <div v-for="unit in getUnitsActive" :key="unit.field">
                <row-unit :unit=unit></row-unit>
            </div>
        </div>
        <row-unit class="unit" v-for="unit in getUnits" :key="unit.field" :unit=unit></row-unit>
        <apply-filters :change="isChange" @change="eventChange"></apply-filters>
    </form>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import RowUnit from '../Unit'
import ApplyFilters from './ApplyFilters'
import vueUrlParameters from 'vue-url-params'

// ... в другом файле

export default {
    mixins: [vueUrlParameters],
    name: 'FormFilter',
    components: {ApplyFilters, RowUnit},
    data () {
        return {
            change: false,
            sorts_units: [],
        }
    },
    computed: {
        ...mapGetters(['allUnits', 'isInitFilers', 'allFilters', 'allSortsUnits', 'isLoading', 'enableBtnReset', 'getHandler']),
        getUnitsActive () {
            let units = []
            this.allUnits.map(function (value, index) {
                if (value.field === 'price' || value.field === 'marker') {
                    units.push(value)
                }
            })
            return units.sort((a, b) => a.rank - b.rank)
        },
        getUnits () {
            let units = []
            this.allUnits.map(function (value, index) {
                if (value.field !== 'price' && value.field !== 'marker') {
                    units.push(value)
                }
                return false
            })
            return units.sort((a, b) => a.rank - b.rank)
        },
        isChange () {
            if (this.isLoading && this.isInitFilers) {
                // Срабатывает при попытке начать загрузку
                // Не зависит от остановки как только isLoading становиться true то мы начинаем показывать кнопку
                this.change = true
            }
            return this.change
        },
    },
    methods: {
        ...mapActions(['initFilters', 'setURI']),
        ...mapMutations(['updateInitFilers']),
        eventChange (change) {
            this.change = change
        },
    },
    created () {
        this.initFilters(this.getFiltersFromUrl({}))

    },
    async mounted () {
        // Установка URI по умлчанию
        this.setURI(document.location.pathname)
    },
    updated () {

        if (!this.isInitFilers) {
            // оообщаем что инициализация прошла успешно так как форма полностью загружена
            this.updateInitFilers(true)
            //console.warn('init form')
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.listing_filters_element {
    max-width: 300px;
}
</style>
