<template>
  <div>
    <svg :width="side + 'px'" :height="side + 'px'" :viewBox="'0 0 ' + side + ' ' + side" ref="_svg"
      @touchmove="handleTouchMove"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <g>
        <circle :stroke="circleColor" fill="none" :stroke-width="mainCircleStrokeWidth" :cx="center" :cy="center" :r="radius"></circle>
        <path :stroke="progressColor" fill="none" :stroke-width="pathStrokeWidth" :d="pathD"></path>
        <circle v-if="rangeSlider" :fill="minKnobColor" :r="cpMinKnobRadius" :cx="minKnobX" :cy="minKnobY"></circle>
        <circle :fill="maxKnobColor" :r="cpMaxKnobRadius" :cx="pathX" :cy="pathY"></circle>
      </g>
    </svg>
  </div>
</template>
<script>
import _debounce from "lodash.debounce"
// import _throttle from "lodash.throttle"

export default {
  name: 'CircleSlider',
  created () {
    this.stepsCount = 1 + (this.max - this.min) / this.stepSize
    this.steps = Array.from({
      length: this.stepsCount
    }, (_, i) => this.min + i * this.stepSize)

    this.defineInitialCurrentStepIndex()

    this.minAngle = this.minAngleValue
    this.maxAngle = this.maxAngleValue

    this.currentMinStepValue = this.currentMinStep
    this.currentMaxStepValue = this.currentMaxStep

    let maxCurveWidth = Math.max(this.mainCircleStrokeWidth, this.pathStrokeWidth)
    this.radius = (this.side / 2) - Math.max(maxCurveWidth, this.cpMinKnobRadius * 2, this.cpMaxKnobRadius * 2) / 2

    this.updateFromPropMaxValue(this.value)
    this.currentMinStepIndex > this.currentMaxStepIndex ? this.setDefaultMinValue() : this.updateFromPropMinValue(this.minValue)
  },
  mounted () {
    this.containerElement = this.$refs._svg
    this.sliderTolerance = this.radius / 2
    this.setInitialPosition()
    this.containerElement.addEventListener('wheel', this.handleWheelScroll)
  },
  beforeDestroy () {
    this.containerElement.removeEventListener('wheel', this.handleWheelScroll)
  },
  props: {
    startAngleOffset: {
      type: Number,
      default: 90 // degrees 
    },
    value: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number,
      default: 0
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
      steps: null,
      stepsCount: null,
      radius: 0,
      maxAngle: 0,
      minAngle: 0,
      currentMinStepValue: 0,
      currentMaxStepValue: 0,
      mousePressed: false,
      mousemoveTicks: 0,
      currentMinStepIndex: 0,
      currentMaxStepIndex: 0,
      length: 0,
      sliderTolerance: 0,
      relativeX: 0,
      relativeY: 0,
      redundantAngle: 0,
      currentKnob: ''
    }
  },
  computed: {
    stepsLength () {
      return this.steps.length - 1
    },
    center () {
      return this.side / 2
    },
    cpMinAngle () {
      if (this.counterClockwise) return (this.minAngle + Math.PI / 2) - this.startAngleOffsetRadians
      return this.minAngle + this.startAngleOffsetRadians
    },
    cpMaxAngle () {
      if (this.counterClockwise) return (this.maxAngle + Math.PI / 2) - this.startAngleOffsetRadians
      return this.maxAngle + this.startAngleOffsetRadians
    },
    mainCircleStrokeWidth () {
      return this.circleWidth || (this.side / 2) / this.circleWidthRel
    },
    pathDirection () {
      if (this.counterClockwise) return (this.maxAngle - this.minAngle < Math.PI) ? 0 : 1
      return (this.cpMaxAngle - (this.cpMinAngle - Math.PI / 2) < 3 / 2 * Math.PI) ? 0 : 1
    },
    pathX () {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.cpMaxAngle)
      return this.center + this.radius * Math.cos(this.cpMaxAngle)
    },
    pathY () {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.cpMaxAngle)
      return this.center + this.radius * Math.sin(this.cpMaxAngle)
    }, 
    pathStrokeWidth () {
      return this.progressWidth || (this.side / 2) / this.progressWidthRel
    },
    cpMinKnobRadius () {
      return this.minKnobRadius || (this.side / 2) / this.minKnobRadiusRel
    },
    cpMaxKnobRadius () {
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
    minAngleValue () {
      return (Math.min(
        this.angleUnit * this.currentMinStepIndex,
        Math.PI * 2 - Number.EPSILON
      ))
    },
    maxAngleValue () {
      return (Math.min(
        this.angleUnit * this.currentMaxStepIndex,
        Math.PI * 2 - Number.EPSILON
      )) - 0.0001 // correct for 100% value
      // - 0.00001 // correct for 100% value
    },
    currentMinStep () {
      return this.steps[this.currentMinStepIndex]
    },
    currentMaxStep () {
      return this.steps[this.currentMaxStepIndex]
    },
    sliderAngle () {
      return (Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + this.startAngleOffsetRadians * 3 - this.redundantAngle) % (Math.PI * 2)
    },
    isTouchWithinSliderRange () {
      const touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.center), 2) + Math.pow(Math.abs(this.relativeY - this.center), 2))
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance
    },
    startAngleOffsetRadians () {
      return this.startAngleOffset / 180 * Math.PI
    },
    minKnobX () {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.cpMinAngle)
      return this.center + this.radius * Math.cos(this.cpMinAngle)
    },
    minKnobY () {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.cpMinAngle)
      return this.center + this.radius * Math.sin(this.cpMinAngle)
    }
  },
  methods: {
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
      this.mousePressed = true

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
      this.mousePressed = false
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
      const valueFromScroll = e.wheelDelta > 0 ?  this.value + this.stepSize : this.value - this.stepSize
      if ((this.currentMaxStepValue === 0 && e.wheelDelta < 0) || (this.currentMaxStepValue === 100 && e.wheelDelta > 0)) return
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
    updateMinAngle (angle, isAnimationFinished) {
      this.updateCurrentMinStepFromAngle(angle)
      this.minAngle = this.minAngleValue

      this.currentMinStepValue = this.currentMinStep
        
      if (isAnimationFinished) {
        this.$emit('update:minValue', this.currentMinStepValue) 
      }
      // const emitValue = () => this.$emit('inputMin', this.currentMinStepValue)
      // const throttled = _throttle(emitValue, 500)
      // throttled()
    },
    updateMaxAngle (angle, isAnimationFinished) {
      this.updateCurrentMaxStepFromAngle(angle)
      this.maxAngle = this.maxAngleValue

      this.currentMaxStepValue = this.currentMaxStep

      if (isAnimationFinished) {
        this.$emit('input', this.currentMaxStepValue)
      }
      // const emitValue = () => this.$emit('input', this.currentMaxStepValue)
      // const throttled = _throttle(emitValue, 1000)
      // throttled()
    },
    updateFromPropMinValue (minValue) {
      let previousAngle = this.minAngle
      
      let minStepValue = this.fitToStep(minValue)
      this.updateCurrentMinStepFromValue(minStepValue)

      this.minAngle = this.minAngleValue
      this.currentMinStepValue = minStepValue
      this.animateSlider(previousAngle, this.minAngle)
    },
    updateFromPropMaxValue (maxValue) {
      let previousAngle = this.maxAngle
      
      let maxStepValue = this.fitToStep(maxValue)
      this.updateCurrentMaxStepFromValue(maxStepValue)

      this.maxAngle = this.maxAngleValue
      this.currentMaxStepValue = maxStepValue
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
          if (this.currentKnob === 'max') this.updateMaxAngle(endAngle, true)
          else if (this.currentKnob === 'min') this.updateMinAngle(endAngle, true)
        } else {
          const newAngle = startAngle + curveAngleMovementUnit
          if (this.currentKnob === 'max') this.updateMaxAngle(newAngle, false)
          else if (this.currentKnob === 'min') this.updateMinAngle(newAngle, false)
          this.animateSlider(newAngle, endAngle)
        }
      }
      window.requestAnimationFrame(animate)
    },
    defineInitialCurrentStepIndex () {
      for (let stepIndex in this.steps) {
        if (this.steps[stepIndex] === this.minValue) {
          this.currentMinStepIndex = stepIndex
        }
        if (this.steps[stepIndex] === this.value) {
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
        this.relativeX = dimensions.right - ( e.clientX || e.x )
      } else this.relativeX = ( e.clientX || e.x ) - dimensions.left
      this.relativeY = ( e.clientY || e.y ) - dimensions.top

      this.calculateRedundantAngle()
    },
    calculateRedundantAngle () {
      const totalAngle = Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + this.startAngleOffsetRadians * 3
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
      const halfKnobAngleInDegrees = this.cpMinKnobRadius / ((2 * Math.PI * this.radius) / 360)
      const halfKnobAngleInRadians = halfKnobAngleInDegrees / 180 * Math.PI
      if (newAngle + halfKnobAngleInRadians > Math.PI * 2) this.currentKnob = ''
    },
    setDefaultMinValue () {
      const defaultMinValue = this.currentMinStepValue
      this.updateFromPropMinValue(defaultMinValue)
      this.$emit('inputMin', defaultMinValue) 
    },
    setDefaultMaxValue () {
      const defaultMaxValue = this.currentMaxStepValue
      this.updateFromPropMaxValue(defaultMaxValue)
      this.$emit('input', defaultMaxValue) 
    }
  },
  watch: {
    value (val) {
      if (val === this.currentMaxStepValue) return 
      this.currentKnob = 'max'

      const waitFinalMaxValueFromInput = _debounce(this.setDefaultMaxValue, 5000)
      // waitFinalMaxValueFromInput.cancel()
      if (val < this.minValue) waitFinalMaxValueFromInput()
      else this.updateFromPropMaxValue(val)
    },
    minValue (val) {
      if (!this.rangeSlider || val === this.currentMinStepValue) return 
      this.currentKnob = 'min'
      val > this.value ? this.setDefaultMinValue() : this.updateFromPropMinValue(val)
    }
  }
}
</script>
