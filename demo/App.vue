<template>
  <div id="app">
    <circle-slider 
      v-model="sliderValue"
      :side="300"
      :step-size="stepSize"
      :circle-width="20"
      :counter-clockwise="false"
      :start-angle-offset="90"
      :max-knob-radius="20"
      :min-knob-radius="20"
      :range-slider="true"
      :min-knob-color="minKnobColor"
    >
    </circle-slider>
    <!-- <div class="value"> {{ sliderValue }} </div>
    <input type="number" v-model="sliderValue" :step="stepSize"> -->
    <div class="value"> {{ sliderValue.maxValue }} </div>
    <input type="number" v-model.number="sliderValue.maxValue" :step="stepSize">
    <input  type="number" v-model.number="sliderValue.minValue" :step="stepSize">
    <div class="min-value"> {{ sliderValue.minValue }} </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      minKnobColor: '#EA1313',
      // sliderValue: 0,
      sliderValue: {
        maxValue: 54,
        minValue: 21
        // minValue: 0
      },
      stepSize: 1
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