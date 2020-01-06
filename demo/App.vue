<template>
  <div id="app">
    <circle-slider 
      v-model="sliderMaxValueOrZero"
      :side="300"
      :circle-width="20"
      :counter-clockwise="false"
      :start-angle-offset="250"
      :max-knob-radius="20"
      :min-knob-radius="20"
      :min-value.sync="sliderMinValueOrZero"
      :range-slider="false"
      :min-knob-color="minKnobColor"
    >
    </circle-slider>
    <div class="value"> {{ sliderMaxValue }} </div>
    <input type="number" v-model.number="sliderMaxValue">
    <input  type="number" v-model.number="sliderMinValue">
    <div class="min-value"> {{ sliderMinValue }} </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sliderMaxValue: 0,
      sliderMinValue: 0,
      minKnobColor: '#EA1313'
    }
  },
  computed: {
    sliderMaxValueOrZero: {
      get () {
        return this.sliderMaxValue === '' ? 0 : this.sliderMaxValue
      },
      set (value) {
        this.sliderMaxValue = value
      }
    },
    sliderMinValueOrZero: {
      get () {
        return this.sliderMinValue === '' ? 0 : this.sliderMinValue
      },
      set (value) {
        this.sliderMinValue = value
      }
    }
  }
}
</script>

<style>
  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 200px;
  }

  .heading {
    font-size: 30px;
    font-weight: 700;
    margin-top: 100px;
    margin-bottom: 50px;
  } 

  .value {
    font-size: 20px;
    margin-top: 20px;
  }

  .min-value {
    font-size: 20px;
    margin-top: 20px;
  }

  input {
    height: 30px;
    font-size: 20px;
    margin-top: 30px;
  }
</style>