<template>
  <div class="hello">

    <div class="row">
      <div class="col-12">
        <h3>{{ msg }}</h3>
      </div>
    </div>
    <br>
    <br>
    <div class="container">

      <div class="row">
        <div class="col-3">
          <slider-input :label="filterInfo.fieldList[0]['label']" :handles="filterInfo.values.price" :min="filterInfo.values.price[0]" :max="filterInfo.values.price[1]" @input="handlerSlider"></slider-input>
        </div>
        <div class="col-9">
          <h4>Фильтрация</h4>
          <pre>
              {{ getFilters }}
        </pre>

          <h4>Список товаров</h4>
          <pre>
          {{ allFilters }}
        </pre>
        </div>
      </div>

    </div>
    <br>
    <br>
    <br>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SliderInput from './../components/Filtes/Sliders/SliderInput.vue'

export default {
  name: 'HelloWorld',
  components: {SliderInput},
  props: {
    msg: String,
  },
  data () {
    return {
      filterDefaultData: {
        price: null
      },
      filterData: {
        price: null
      },
      filters: {
        sort: {
          field: 'pageitle',
          dir: 'ASC',
        },
        data: {
          color: [
            {
              title: 'Красный',
              value: 'Красный'
            },
            {
              title: 'Зеленый',
              value: 'Зеленый'
            }
          ],
          size: [
            {
              title: 'Большой',
              value: 'Большой'
            },
            {
              title: 'Меленький',
              value: 'Меленький'
            }
          ]
        }
      },
      filterInfo: {
        data: {
          name: null,
          age: null,
          count: 1,
          sex: 1,
          date: null,
          dateTime: null,
          range: null
        },
        listOpen: {
          style: 3,
          interer: 3,
        },
        values: {
          style: ['Современный', 'Классический', 'Модерн'],
          interer: ['Для гостиной', 'Для спальни', 'Для офиса'],
          price: [763, 500000]
        },
        suggestions: {
          armature_color: {
            'Бежевый': 763,
            'Белый': 7911,
            'Бронза': 2603,
          },
          price: [763, 7911]
        },
        fieldList: [
          {
            label: 'Цена',
            type: 'slider',
            name: 'prices',
            open: false, // открыть фильтр или закрыт
          },
          {
            icon: 'sale',
            label: 'Распродажа',
            type: 'boolean',
            name: 'sale',
          },
          {
            icon: 'new',
            label: 'Новый',
            type: 'boolean',
            name: 'new',
          },
          {
            icon: 'availability',
            label: 'В наличии',
            type: 'boolean',
            name: 'availability',
          },
          {
            label: 'Стиль',
            type: 'checkbox',
            name: 'style',
            open: false, // открыть фильтр или закрыт
          },
          {
            label: 'Тип комнаты',
            type: 'checkbox',
            name: 'interer',
            open: true, // открыть фильтр или закрыт
          },
          {
            label: 'input age',
            type: 'input',
            value: 'age',
            disabled: true
          },
          {
            label: 'Input Count',
            type: 'inputNumber',
            value: 'count',
            min: 1,
            max: 10
          },
          {label: 'Sex', type: 'select', value: 'sex', list: 'sexList'},
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['allPosts', 'allFilters']),
    getFilters () {
      return this.filterData
    }
  },
  methods: {
    ...mapActions(['fetchPosts', 'fetchFilters']),
    handlerSlider (val) {
      console.log(val)
      this.filterData.price = [val[0], val[1]]
    }
  },
  async mounted () {
    this.fetchPosts()
    this.fetchFilters()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
