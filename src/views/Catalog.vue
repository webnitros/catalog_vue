<template>
    <div class="home">
        <form-filter @input="submit"></form-filter>
    </div>
</template>


<script>
import FormFilter from './../components/Form/Filter.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import vueUrlParameters from 'vue-url-params'
import Multiselect from 'vue-multiselect'

export default {

    mixins: [vueUrlParameters],
    components: {FormFilter, Multiselect},
    data () {
        return {
            showResponseAggregations: false,
            showBoolFilter: false,
            showPostFilter: false,
            showAggs: false,
            showFilters: false,
            searchParams: {},
            sort: null,
            limit: 30,
            sortOptions: [
                {name: 'По популярности', sort: 'ms|popular_count:desc'},
                {name: 'По наименованию', sort: 'resource|pagetitle:asc'},
                {name: 'Сначала дешевле', sort: 'ms|price:desc'},
                {name: 'Сначала дороже', sort: 'ms|price:asc'},
            ],
            limitOptions: [30, 60, 90]
        }
    },
    computed: {
        ...mapGetters(['allFilters', 'allElastic', 'totalProducts', 'allParams', 'allProducts', 'isLoading', 'getLimit', 'allSearchParams', 'getSort', 'getLimit']),
        boolFilter () {
            return this.allElastic.request.body.query || {}
        },
        postFilter () {
            return this.allElastic.request.body.post_filter || {}
        },
        aggs () {
            return this.allElastic.request.body.aggs || {}
        },
        filters () {
            return this.allElastic.request.body.aggs.filters || {}
        },
        responseAggregations () {
            return this.allElastic.response.aggregations || {}
        },
        total () {
            if (!this.allElastic.response) {
                return 0
            }
            return this.allElastic.response.hits.total || 0
        }
    },
    methods: {
        ...mapActions(['fetchProducts', 'initFilters']),
        ...mapMutations(['updateLoading', 'updateSort', 'updateLimit']),
        submit (params) {
            if (params === undefined) {
                params = this.getFiltersFromUrl({})
                params['build'] = true
            }
            this.fetchProducts(params)
        },
        toggleShowBoolFilter () {
            this.showBoolFilter = !this.showBoolFilter
        },
        toggleShowPostFilter () {
            this.showPostFilter = !this.showPostFilter
        },
        toggleShowAggs () {
            this.showAggs = !this.showAggs
        },
        toggleShowFilters () {
            this.showFilters = !this.showFilters
        },
        toggleShowResponseAggregations () {
            this.showResponseAggregations = !this.showResponseAggregations
        }
    },
    async mounted () {
        this.sort = this.getSort
        this.limit = this.getLimit
    },
    watch: {
        sort (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.updateSort(newValue)
                this.submit()
            }
        },
        limit (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.updateLimit(newValue)
                this.submit()
            }
        }
    }
}
</script>

<style scoped>
.headers {
    height: 200px;
}

.loading {
    opacity: 0.3;
}

.top_filter_menu {
    margin-bottom: 20px;
}

.top_filter_menu_wrap {
    display: flex;
    width: 100%;
}


.top_filter_menu_select {
    min-width: 235px;
    max-width: 235px;
    box-shadow: none;
    height: 40px;
    border-radius: 3px;
    padding: 0;
}

.top_filter_menu_tabs {
    margin-left: auto;
    margin-right: 0;
}

.top_filter_menu_pager {
    margin-left: 47px;
}

.listing_content_choice {
    background: #FFF3CA;
    padding: 5px 8px 0px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
}
</style>
