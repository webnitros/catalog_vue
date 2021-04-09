<template>
    <section class="class">
        <div class="listing_filters_slide">
            <div class="unit">
                <div class="nice-select" tabindex="0">
                    <span class="current" @click="showParentList"><b>Тип светильника</b></span>
                    <ul class="list" v-show="show_parent">
                        <li v-for="(category,index) in getCategories" class="option selected" @click="changeParent(category)">
                            {{ category.pagetitle }}
                        </li>
                    </ul>
                </div>
                <div class="listing_filters_slide_choice">
                    <small @click="showParentList" v-if="parent_title">{{ parent_title }}</small>
                </div>
            </div>
            <div class="unit">
                <div class="nice-select" tabindex="0">
                    <span class="current" @click="showChildList"><b>Вид светильника</b></span>
                    <ul class="list" v-show="show_child">
                        <li v-for="(category,index) in getChildren" data-value="" @click="changeChild(category)" class="option selected">{{ category.pagetitle }}</li>
                    </ul>
                </div>
                <div class="listing_filters_slide_choice">
                    <small @click="showChildList" v-if="child_title">{{child_title }}</small>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    data: function () {
        return {
            parent_title: '',
            child_title: '',
            show_parent: false,
            show_child: false,
            children: null
        }
    },
    computed: {
        ...mapGetters(['allCategories']),
        getCategories () {
            let selected = this.allCategories.filter(item => item.selected === true)
            if (selected.length) {
                this.parent_title = selected[0].pagetitle
                this.children = selected[0].children
            } else {
                this.parent_title = ''
                this.children = null
            }
            return this.allCategories
        },
        getChildren () {
            if (this.children) {
                const index = this.children.findIndex(item => item.selected === true)
                if (index !== -1) {
                    this.child_title = this.children[index].pagetitle
                } else {
                    this.child_title = ''
                }
            } else {
                this.child_title = ''
            }

            return this.children
        }
    },
    methods: {
        changeParent (newValue) {
            this.child_title = '';
            this.parent_title = newValue.pagetitle
            this.hideList()
            this.$emit('input', newValue.uri)
        },
        changeChild (newValue) {
            this.child_title = newValue.pagetitle
            this.hideList()
            this.$emit('input', newValue.uri)
        },
        showParentList () {
            this.show_parent = !this.show_parent
        },
        showChildList () {
            this.show_child = !this.show_child
        },
        hideList () {
            this.show_parent = false
            this.show_child = false
        }
    }
}
</script>
