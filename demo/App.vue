<template>
  <div id="app">
    <circle-slider 
      v-model="minMaxValues"
      :side="300"
      :step-size="1"
      :circle-width="20"
      :counter-clockwise="false"
      :start-angle-offset="90"
      :max-knob-radius="20"
      :min-knob-radius="20"
      :range-slider="true"
      :min-knob-color="minKnobColor"
    >
    </circle-slider>
    <div class="value"> {{ minMaxValues.maxValue }} </div>
    <input type="number" v-model.number="minMaxValues.maxValue">
    <input  type="number" v-model.number="minMaxValues.minValue">
    <div class="min-value"> {{ minMaxValues.minValue }} </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      minKnobColor: '#EA1313',
      minMaxValues: {
        minValue: 0,
        maxValue: 0
      }
    }
  }
  // computed: {
  //   sliderMaxValueOrZero: {
  //     get () {
  //       return this.minMaxValues.maxValue === '' ? 0 : this.minMaxValues.maxValue
  //     },
  //     set (value) {
  //       this.minMaxValues.maxValue = value
  //       // this.sliderMaxValue = value
  //     }
  //   },
  //   sliderMinValueOrZero: {
  //     get () {
  //       return this.minMaxValues.minValue === '' ? 0 : this.minMaxValues.minValue
  //     },
  //     set (value) {
  //       this.minMaxValues.minValue = value
  //       // this.sliderMinValue = value
  //     }
  //   }
  // }
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