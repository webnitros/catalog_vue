<template>
  <div>
    <label for="price" class="slider__label">
      {{label}}
    </label>
    <div>
      <veeno
          :handles=handles
          :inputName=inputName
          :tooltips=tooltips
          :connect=connect
          :getset=getHandlerSlider
          :padding=padding
          :range=range
          v-model=sliderValue
      />
    </div>
  </div>
</template>

<script>
import veeno from 'veeno'

export default {
  name: 'SliderInput',
  components: {
    veeno
  },
  props: {
    handles: {
      type: Array,
      default: () => {
        return []
      }
    },
    min: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      sliderValue: 0,
      values: [this.min, this.max],
      //handles: [0, 800000],
      range: {
        min: [this.min],
        '85%': [100000],
        max: [this.max]
      },
      inputName: 'Привет',
      padding: [45, 45],
      handler: null,
      tooltips: [false, false],
      connect: true,
      pipsy: {
        mode: 'range',
        density: 4
      },
    }
  },
  computed: {
    getMin () {
      return this.values
    }
  },
  methods: {
    getHandlerSlider (val) {
      this.handler = val.noUiSlider
    }
  },
  watch: {
    sliderValue () {
      if (this.handler) {
        const tmp = this.handler.get()
        const min = parseInt(tmp[0])
        const max = parseInt(tmp[1])

        let isChange = false
        if (this.values[0] !== min) {
          this.values[0] = min
          isChange = true
        }
        if (this.values[1] !== max) {
          this.values[1] = max
          isChange = true
        }
        if (isChange) {
          this.$emit('input', this.values)
        }
      }
    }
  }

}
</script>

<style scoped>
.slider__label {
  margin-bottom: 20px;
}
</style>
