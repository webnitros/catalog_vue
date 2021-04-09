<template>

    <div v-scroll-to="'#mse2_results'" v-bind:style="{ top: getTopPosition+ 'px' }" @click="submit" v-show="isChange" id="apply-filters-float-btn" class="apply-filters-float-btn">
        <div class="apply-filters-text">Показать</div>
        <div v-if="isLoading" class="sk-wave apply-filters-total">
            <div class="sk-rect sk-rect-1"></div>
            <div class="sk-rect sk-rect-2"></div>
            <div class="sk-rect sk-rect-3"></div>
            <div class="sk-rect sk-rect-4"></div>
        </div>
        <div v-else class="sk-wave apply-filters-total">
            {{ totalProducts }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'ApplyFilters',
    props: {
        change: {
            type: Boolean,
            default: false,
        },
        delay: {
            type: Number,
            default: 5000,
        }
    },
    data () {
        return {
            timerId: null,
            top: 382
        }
    },
    computed: {
        ...mapGetters(['totalProducts', 'isLoading', 'getTopPosition']),
        isChange () {
            return this.change
        }
    },
    methods: {
        ...mapMutations(['rankFilters']),
        hide () {
            this.$emit('change', false)
        },
        show () {
            // Выполняем запрос на сервер
            if (this.timerId !== null) {
                clearTimeout(this.timerId)
            }
            const $this = this
            this.timerId = setTimeout(function () {
                $this.timerId = null
                $this.hide()
            }, this.delay)
        },
        submit: function () {
            this.hide()
        }
    },
    watch: {
        change (newValue) {
            if (newValue === true) {
                this.show()
            }
        }
    }
}
</script>

<style scoped>
.apply-filters-float-btn {
    border-radius: 2px;
    width: auto;
    padding: 0;
    font-size: 14px;
    line-height: 30px;
    height: 40px;
    border: none;
    outline: none;
    cursor: pointer;
    color: #fff;
    background: #DE5617;
    position: absolute;
    left: 100%;
    margin-left: 28px;
    margin-top: 4px;
    z-index: 8;
    display: flex;
    padding-left: 11px;
}

.apply-filters-float-btn:before {
    display: block;
    content: '';
    position: absolute;
    left: -6px;
    top: 13px;
    background: #DE5617;
    width: 14px;
    height: 14px;
    border-radius: 4px;
    transform: rotate(135deg);
    z-index: 0;
}

.apply-filters-text {
    font-size: 14px;
}

/*.apply-filters-float-btn:after {
    border-radius: 8px;
    box-shadow: inherit;
    display: block;
    content: 'РџРѕРєР°Р·Р°С‚СЊ';
    position: absolute;
    left: 0;
    top: 0;
    background-image: inherit;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    z-index: 1
}*/

.apply-filters-float-btn:hover {
    background: #5DAC0D;
}

.apply-filters-float-btn:hover:before {
    background: #5DAC0D;
}


.apply-filters-float-btn .corner {
    bottom: -30px;
    display: block;
    height: 30px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 25px
}

.apply-filters-text {
    margin-top: auto;
    margin-bottom: auto;
}

.apply-filters-float-btn .corner:before {
    bottom: 10px;
    color: transparent;
    content: " ";
    font-size: 0;
    left: -20px;
    position: absolute;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 20px solid transparent;
    border-right-color: #e66800
}

.apply-filters-float-btn .corner:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 10px solid transparent;
    border-left-color: #994500;
    bottom: 0;
    color: transparent;
    content: " ";
    font-size: 0;
    left: 10px;
    position: absolute;
    z-index: -1
}

.apply-filters-float-btn:hover .corner:before {
    border-right-color: #da4e13
}

.apply-filters-float-btn:hover .corner:after {
    border-left-color: #f9621c
}

.apply-filters-float-btn .sk-wave {
    position: static;
    z-index: 1111;
    left: 0;
    top: 19px;
    text-align: left;
    width: auto;
    min-width: 56px;
    padding-right: 20px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: normal;
    line-height: 24px;
}

@media (max-width: 1100px) {
    .apply-filters-float-btn {
        right: 0%;
        left: initial;
        margin-top: -20px;
        height: 34px;
    }

    .apply-filters-float-btn:before {

    }

    .apply-filters-float-btn:before {
        left: -5px;
        top: 11px;
        width: 12px;
        height: 12px;
        border-radius: 0px;
    }
}


.sk-wave {
    width: 6em;
    height: 16px;
    margin: auto;
    text-align: center;
    font-size: 16px;
    box-sizing: initial;
}

.sk-wave .sk-rect {
    background-color: rgb(255, 255, 255);
    height: 100%;
    margin: 0 1px;
    width: 2px;
    display: inline-block;
    -webkit-animation: sk-wave-stretch-delay 1.2s infinite ease-in-out;
    animation: sk-wave-stretch-delay 1.2s infinite ease-in-out;
}

.sk-wave .sk-rect-1 {
    -webkit-animation-delay: -1.2s;
    animation-delay: -1.2s;
}

.sk-wave .sk-rect-2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.sk-wave .sk-rect-3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

.sk-wave .sk-rect-4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.sk-wave .sk-rect-5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

@-webkit-keyframes sk-wave-stretch-delay {
    0%, 40%, 100% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
    }
}

@keyframes sk-wave-stretch-delay {
    0%, 40%, 100% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
    }
}

</style>
