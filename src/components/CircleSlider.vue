<template>
  <div>
    <svg 
      :width="side + 'px'" 
      :height="side + 'px'" 
      :viewBox="'0 0 ' + side + ' ' + side" 
      ref="_svg"
      @touchmove="handleTouchMove"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <g>
        <circle 
          :stroke="circleColor" 
          :stroke-width="mainCircleStrokeWidth" 
          :cx="center" 
          :cy="center" 
          :r="radius"
          fill="none" 
        ></circle>
        <path 
          :stroke="progressColor" 
          :stroke-width="pathStrokeWidth" 
          :d="pathD"
          fill="none" 
        ></path>
        <circle 
          v-if="rangeSlider" 
          :fill="minKnobColor" 
          :r="minKnobRadiusFinal" 
          :cx="minKnobX" 
          :cy="minKnobY"
        ></circle>
        <circle 
          :fill="maxKnobColor" 
          :r="maxKnobRadiusFinal" 
          :cx="pathX" 
          :cy="pathY"
        ></circle>
      </g>
    </svg>
  </div>
</template>
<script>
import { debounce, throttle, castValue } from './utils'
export default {
  name: 'CircleSlider',
  props: {
    startAngleOffset: {
      type: Number,
      default: 90 // degrees 
    },
    value: {
      type: [Number, Object, String]
    },
    side: {
      type: Number,
      default: 100
    },
    stepSize: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    circleColor: {
      type: String,
      default: '#334860'
    },
    progressColor: {
      type: String,
      default: '#00be7e'
    },
    minKnobColor: {
      type: String,
      default: '#00be7e'
    },
    maxKnobColor: {
      type: String,
      default: '#00be7e'
    },
    minKnobRadius: {
      type: Number,
      default: null
    },
    minKnobRadiusRel: {
      type: Number,
      default: 7
    },
    maxKnobRadius: {
      type: Number,
      default: null
    },
    maxKnobRadiusRel: {
      type: Number,
      default: 7
    },
    circleWidth: {
      type: Number,
      default: null
    },
    circleWidthRel: {
      type: Number,
      default: 20
    },
    progressWidth: {
      type: Number,
      default: null
    },
    progressWidthRel: {
      type: Number,
      default: 10
    },
    counterClockwise: {
      type: Boolean,
      default: false
    },
    rangeSlider: {
      type: Boolean,
      default: false
    }
    // limitMin: {
    //   type: Number,
    //   default: null
    // },
    // limitMax: {
    //   type: Number,
    //   default: null
    // }
  },
  data () {
    return {
      mousemoveTicks: 0,
      currentMinStepIndex: 0,
      currentMaxStepIndex: 0,
      relativeX: 0,
      relativeY: 0,
      redundantAngle: 0,
      currentKnob: '',
      sliderValues: {
        maxValue: 0,
        minValue: 0
      }
    }
  },
  computed: {
    stepsCount () {
      return 1 + (this.max - this.min) / this.stepSize
    },
    steps () {
      return Array.from({
        length: this.stepsCount
      }, (_, i) => this.min + i * this.stepSize)
    },
    radius () {
      let maxCurveWidth = Math.max(this.mainCircleStrokeWidth, this.pathStrokeWidth)
      return (this.side / 2) - Math.max(maxCurveWidth, this.minKnobRadiusFinal * 2, this.maxKnobRadiusFinal * 2) / 2
    },
    sliderTolerance () {
      return this.radius / 2
    },
    stepsLength () {
      return this.steps.length - 1
    },
    center () {
      return this.side / 2
    },
    minAngleFinal () {
      if (this.counterClockwise) return (this.minAngle + Math.PI / 2) - this.startAngleOffsetRadians
      return this.minAngle + this.startAngleOffsetRadians
    },
    maxAngleFinal () {
      if (this.counterClockwise) return (this.maxAngle + Math.PI / 2) - this.startAngleOffsetRadians
      return this.maxAngle + this.startAngleOffsetRadians
    },
    mainCircleStrokeWidth () {
      return this.circleWidth || (this.side / 2) / this.circleWidthRel
    },
    pathDirection () {
      if (this.counterClockwise) return (this.maxAngle - this.minAngle < Math.PI) ? 0 : 1
      return (this.maxAngleFinal - (this.minAngleFinal - Math.PI / 2) < 3 / 2 * Math.PI) ? 0 : 1
    },
    pathX () {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.maxAngleFinal)
      return this.center + this.radius * Math.cos(this.maxAngleFinal)
    },
    pathY () {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.maxAngleFinal)
      return this.center + this.radius * Math.sin(this.maxAngleFinal)
    }, 
    pathStrokeWidth () {
      return this.progressWidth || (this.side / 2) / this.progressWidthRel
    },
    minKnobRadiusFinal () {
      return this.minKnobRadius || (this.side / 2) / this.minKnobRadiusRel
    },
    maxKnobRadiusFinal () {
      return this.maxKnobRadius || (this.side / 2) / this.maxKnobRadiusRel
    },
    pathD () {
      let parts = []
      parts.push('M' + this.minKnobX)
      parts.push(this.minKnobY)
      parts.push('A')
      parts.push(this.radius)
      parts.push(this.radius)
      parts.push(0)
      parts.push(this.pathDirection)
      parts.push(this.counterClockwise ? 0 : 1 )
      parts.push(this.pathX)
      parts.push(this.pathY)
      return parts.join(' ')
    },
    angleUnit () {
      return (Math.PI * 2) / this.stepsLength
    },
    minAngle () {
      return (Math.min(
        this.angleUnit * this.currentMinStepIndex,
        Math.PI * 2 - Number.EPSILON
      ))
    },
    maxAngle () {
      return (Math.min(
        this.angleUnit * this.currentMaxStepIndex,
        Math.PI * 2 - Number.EPSILON
      )) - 0.0001 // correct for 100% value
    },
    currentMinStepValue () {
      return this.steps[this.currentMinStepIndex]
    },
    currentMaxStepValue () {
      return this.steps[this.currentMaxStepIndex]
    },
    sliderAngle () {
      return (Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + 
        this.startAngleOffsetRadians * 3 - this.redundantAngle) % (Math.PI * 2)
    },
    isTouchWithinSliderRange () {
      const touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.center), 2) + 
        Math.pow(Math.abs(this.relativeY - this.center), 2))
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance
    },
    startAngleOffsetRadians () {
      return this.startAngleOffset / 180 * Math.PI
    },
    minKnobX () {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.minAngleFinal)
      return this.center + this.radius * Math.cos(this.minAngleFinal)
    },
    minKnobY () {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.minAngleFinal)
      return this.center + this.radius * Math.sin(this.minAngleFinal)
    },
    processedValue () {
      if (typeof this.value === 'object') {
        return { 
          maxValue: castValue(this.value.maxValue), 
          minValue: castValue(this.value.minValue)
        }
      } 
      return castValue(this.value)
    }
  },
  watch: {
    processedValue: {
      handler (val) {    
        if (typeof val === 'object') {
          this.updateCurrentValue(val.maxValue, this.sliderValues.maxValue, false)
          this.updateCurrentValue(val.minValue, this.sliderValues.minValue, true)
        }
        else {
          this.updateCurrentValue(val, this.sliderValues.maxValue, false)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateCurrentValue (newValue, prevValue, isMinValue) {
      if (Math.abs(newValue - prevValue) === this.stepSize) {   
        isMinValue ? this.sliderValues.minValue = newValue : this.sliderValues.maxValue = newValue
        this.updateFromPropValue(this.sliderValues)
      } else {        
        isMinValue ? this.sliderValues.minValue = newValue : this.sliderValues.maxValue = newValue
      }
    },
    updateFromPropValue (val) {
      if (val.minValue === this.currentMinStepValue && val.maxValue === this.currentMaxStepValue) return

      if (val.maxValue !== this.currentMaxStepValue) {
        this.currentKnob = 'max'
        val.maxValue < this.sliderValues.minValue ? this.setDefaultMaxValue() : this.updateFromPropMaxValue(val.maxValue)
        return
      }

      if (val.minValue !== this.currentMinStepValue) {
        this.currentKnob = 'min'
        val.minValue > this.sliderValues.maxValue ? this.setDefaultMinValue() : this.updateFromPropMinValue(val.minValue)
      }
    },
    fitToStep (val) {
      return Math.round(val / this.stepSize) * this.stepSize
    },
    handleClick (e) {
      this.setNewPosition(e)
      if (this.isTouchWithinSliderRange) {
        const newAngle = this.sliderAngle
        this.defineCurrentKnob(newAngle)

        if (this.currentKnob === 'min') this.animateSlider(this.minAngle, newAngle)
        else if (this.currentKnob === 'max') this.animateSlider(this.maxAngle, newAngle)
      }
    },
    handleMouseDown (e) {
      e.preventDefault()

      this.setNewPosition(e)
      if (this.isTouchWithinSliderRange) {
        const newAngle = this.sliderAngle
        this.defineCurrentKnob(newAngle)
      }

      window.addEventListener('mousemove', this.handleWindowMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp (e) {
      e.preventDefault()
      window.removeEventListener('mousemove', this.handleWindowMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
      this.mousemoveTicks = 0
    },
    handleWindowMouseMove (e) {
      e.preventDefault()
      if (this.minAngle >= this.maxAngle && this.maxAngle > 0) return

      if (this.mousemoveTicks < 5) {
        this.mousemoveTicks++
        return
      }
      this.setNewPosition(e)
      this.updateSlider()
    },
    handleWheelScroll (e) {
      e.preventDefault()
      if (this.rangeSlider) return
      
      this.currentKnob = 'max'
      const valueFromScroll = e.wheelDelta > 0 ? 
        this.sliderValues.maxValue + this.stepSize : this.sliderValues.maxValue - this.stepSize

      if (
        (this.currentMaxStepValue === 0 && e.wheelDelta < 0) || 
        (this.currentMaxStepValue === 100 && e.wheelDelta > 0)) {
        return
      }
      this.updateFromPropMaxValue(valueFromScroll)      
    },
    handleTouchMove (e) {
      this.$emit('touchmove')
      // Do nothing if two or more fingers used
      if (e.targetTouches.length > 1 || e.changedTouches.length > 1 || e.touches.length > 1) {
        return true
      }

      const lastTouch = e.targetTouches.item(e.targetTouches.length - 1)
      this.setNewPosition(lastTouch)

      if (this.isTouchWithinSliderRange) {
        e.preventDefault()
        const newAngle = this.sliderAngle
        this.defineCurrentKnob(newAngle)
        this.updateSlider()
      }
    },
    updateMinAngle (angle) {
      this.updateCurrentMinStepFromAngle(angle)
      this.emitMinMaxValues()
    },
    updateMaxAngle (angle) {
      this.updateCurrentMaxStepFromAngle(angle)
      this.emitMinMaxValues()
    },
    updateFromPropMinValue (minValue) {
      let previousAngle = this.minAngle
      
      let minStepValue = this.fitToStep(minValue)
      this.updateCurrentMinStepFromValue(minStepValue)

      this.animateSlider(previousAngle, this.minAngle)
    },
    updateFromPropMaxValue (maxValue) {
      let previousAngle = this.maxAngle
      
      let maxStepValue = this.fitToStep(maxValue)
      this.updateCurrentMaxStepFromValue(maxStepValue)

      this.animateSlider(previousAngle, this.maxAngle)
    },
    updateSlider () {
      const angle = this.sliderAngle
      this.defineCurrentKnob(angle)

      if ((this.currentKnob === 'max') && (Math.abs(angle - this.maxAngle) < Math.PI))
        this.updateMaxAngle(angle)
      else if ((this.currentKnob === 'min') && (Math.abs(angle - this.minAngle) < Math.PI))
        this.updateMinAngle(angle)
    },
    animateSlider (startAngle, endAngle) {
      const direction = startAngle < endAngle ? 1 : -1
      const curveAngleMovementUnit = (direction * this.angleUnit * 2) / this.stepSize
      
      const animate = () => {
        if (Math.abs(endAngle - startAngle) < Math.abs(2 * curveAngleMovementUnit)) {
          if (this.currentKnob === 'max') this.updateMaxAngle(endAngle)
          else if (this.currentKnob === 'min') this.updateMinAngle(endAngle)
        } else {
          const newAngle = startAngle + curveAngleMovementUnit
          if (this.currentKnob === 'max') this.updateMaxAngle(newAngle)
          else if (this.currentKnob === 'min') this.updateMinAngle(newAngle)
          this.animateSlider(newAngle, endAngle)
        }
      }
      window.requestAnimationFrame(animate)
    },
    defineInitialCurrentStepIndex () {
      for (let stepIndex in this.steps) {
        if (this.steps[stepIndex] === this.sliderValues.minValue) {
          this.currentMinStepIndex = stepIndex
        }
        if (this.steps[stepIndex] === this.sliderValues.maxValue) {
          this.currentMaxStepIndex = stepIndex
        }
      }
    },
    updateCurrentMinStepFromValue (minValue) {
      for (let i = 0; i < this.stepsLength; i++) {
        if (minValue <= this.steps[i]) {
          this.currentMinStepIndex = i
          return
        }
      }
    },
    updateCurrentMaxStepFromValue (maxValue) {
      for (let i = 0; i < this.stepsLength; i++) {
        if (maxValue <= this.steps[i]) {
          this.currentMaxStepIndex = i
          return
        }
      }
      this.currentMaxStepIndex = this.stepsLength
    },
    updateCurrentMinStepFromAngle (angle) {
      const stepIndex = Math.round(angle / this.angleUnit)
      this.currentMinStepIndex = Math.min(Math.max(stepIndex, 0), this.stepsLength)
    },
    updateCurrentMaxStepFromAngle (angle) {
      const stepIndex = Math.round(angle / this.angleUnit)
      this.currentMaxStepIndex = Math.min(Math.max(stepIndex, 0), this.stepsLength)
    },
    setNewPosition (e) {
      const dimensions = this.containerElement.getBoundingClientRect()
      if (this.counterClockwise) {
        this.relativeX = dimensions.right - (e.clientX || e.x)
      } else this.relativeX = (e.clientX || e.x) - dimensions.left
      this.relativeY = (e.clientY || e.y) - dimensions.top

      this.calculateRedundantAngle()
    },
    calculateRedundantAngle () {
      const totalAngle = Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + 
        this.startAngleOffsetRadians * 3
      if ((this.startAngleOffsetRadians !== Math.PI / 2) && !this.redundantAngle) {
        this.redundantAngle = totalAngle - (Math.PI * 2)
      }
    },
    setInitialPosition () {
      const dimensions = this.containerElement.getBoundingClientRect()
      const x = (this.pathX + dimensions.left).toFixed(0)
      const y = (this.pathY + dimensions.top).toFixed(0)

      this.setNewPosition({x, y})
    },
    defineCurrentKnob (newAngle) {
      if (!this.rangeSlider) {
        this.currentKnob = 'max'
        return  
      }

      if (newAngle > this.maxAngle) this.currentKnob = 'max'
      else if (newAngle < this.minAngle) this.currentKnob = 'min'
      else {
        const offsetFromMax = Math.abs(this.maxAngle - newAngle)
        const offsetFromMin = Math.abs(this.minAngle - newAngle)
        this.currentKnob = offsetFromMax <= offsetFromMin ? 'max' : 'min'
      }
      // Don't move any knob when minKnob is at 0 position and 
      // when it is clicked on its half which overflows "0"
      const halfKnobAngleInDegrees = this.minKnobRadiusFinal / ((2 * Math.PI * this.radius) / 360)
      const halfKnobAngleInRadians = halfKnobAngleInDegrees / 180 * Math.PI
      if (newAngle + halfKnobAngleInRadians > Math.PI * 2) this.currentKnob = ''
    },
    setDefaultMinValue () {
      const defaultMinValue = this.currentMinStepValue
      this.updateFromPropMinValue(defaultMinValue)
      this.emitMinMaxValues()
    },
    setDefaultMaxValue () {
      const defaultMaxValue = this.currentMaxStepValue
      this.updateFromPropMaxValue(defaultMaxValue)
      this.emitMinMaxValues()
    },
    emitMinMaxValues () {
      if (typeof this.value !== 'object') {
        this.$emit('input', this.currentMaxStepValue) 
      } else {
        this.$emit('input', { minValue: this.currentMinStepValue, maxValue: this.currentMaxStepValue }) 
      }
    },
    throttleWheelScroll () {
      const throttleInterval = 30 // make this a prop ?
      return throttle(e => this.handleWheelScroll(e), throttleInterval)
    },
    debounceInput () {
      const debounceWait = 2000 // make this a prop ?
      return debounce(() => this.updateFromPropValue(this.sliderValues), debounceWait)
    }
  },
  created () {
    this.defineInitialCurrentStepIndex()
  },
  mounted () {
    this.containerElement = this.$refs._svg
    this.setInitialPosition()
    this.emitMinMaxValues()
    
    if (!this.rangeSlider) {
      this.containerElement.addEventListener('wheel', this.throttleWheelScroll())
    }
    window.addEventListener('input', this.debounceInput())
  },
  beforeDestroy () {
    this.containerElement.removeEventListener('wheel', this.throttleWheelScroll())
    window.removeEventListener('input', this.debounceInput())
  }
}
</script>
