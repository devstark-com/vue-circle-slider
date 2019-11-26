<template>
  <div id="app">
    <h1 class="heading">
      This is DEMO of the Plugin in App
    </h1>
    <circle-slider 
      v-model="sliderValueOrZero"
      :side="300"
      :circleWidth="20"
      :knobRadius="20"
      :stepSize="1"
      :counterClockwise="true"
    >
    </circle-slider>
    <div class="value"> {{ sliderValue }} </div>
    <input type="number" v-model.number="sliderValue">
  </div>
</template>

<script>
export default {
  data () {
    return {
      sliderValue: 0
    }
  },
  computed: {
    sliderValueOrZero: {
      get () {
        return this.sliderValue === '' ? 0 : this.sliderValue
      },
      set (value) {
        this.sliderValue = value
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

  input {
    height: 30px;
    font-size: 20px;
    margin-top: 30px;
  }
</style>