<template>
  <div>
    <svg :width="side + 'px'" :height="side + 'px'" :viewBox="'0 0 ' + side + ' ' + side" ref="_svg"
      @touchmove="handleTouchMove"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <g>
        <circle :stroke="circleColor" fill="none" :stroke-width="cpMainCircleStrokeWidth" :cx="cpCenter" :cy="cpCenter" :r="radius"></circle>
        <path :stroke="progressColor" fill="none" :stroke-width="cpPathStrokeWidth" :d="cpPathD"></path>
        <circle :fill="maxKnobColor" :r="cpMaxKnobRadius" :cx="cpPathX" :cy="cpPathY"></circle>
        <circle v-if="rangeSlider" :fill="minKnobColor" :r="cpMinKnobRadius" :cx="cpMinKnobX" :cy="cpMinKnobY"></circle>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'CircleSlider',
  created () {
    this.stepsCount = 1 + (this.max - this.min) / this.stepSize
    this.steps = Array.from({
      length: this.stepsCount
    }, (_, i) => this.min + i * this.stepSize)

    this.defineInitialCurrentStepIndex()

    this.minAngle = this.cpMinAngleValue
    this.maxAngle = this.cpMaxAngleValue

    this.currentMinStepValue = this.cpCurrentMinStep
    this.currentMaxStepValue = this.cpCurrentMaxStep

    let maxCurveWidth = Math.max(this.cpMainCircleStrokeWidth, this.cpPathStrokeWidth)
    this.radius = (this.side / 2) - Math.max(maxCurveWidth, this.cpMinKnobRadius * 2, this.cpMaxKnobRadius * 2) / 2
    
    this.updateFromPropMaxValue(this.value)
    this.currentMinStepIndex > this.currentMaxStepIndex ? this.setDefaultMinValue() : this.updateFromPropMinValue(this.minValue)
  },
  mounted () {
    this.containerElement = this.$refs._svg
    this.sliderTolerance = this.radius / 2
    this.setNewPosition({x: 0, y: 0})
  },
  props: {
    startAngleOffset: {
      type: Number,
      required: false,
      default: function () {
        return 0
      }
    },
    value: {
      type: Number,
      required: false,
      default: 0
    },
    minValue: {
      type: Number,
      required: false,
      default: 0
    },
    side: {
      type: Number,
      required: false,
      default: 100
    },
    stepSize: {
      type: Number,
      required: false,
      default: 1
    },
    min: {
      type: Number,
      required: false,
      default: 0
    },
    max: {
      type: Number,
      required: false,
      default: 100
    },
    circleColor: {
      type: String,
      required: false,
      default: '#334860'
    },
    progressColor: {
      type: String,
      required: false,
      default: '#00be7e'
    },
    minKnobColor: {
      type: String,
      required: false,
      default: '#00be7e'
    },
    maxKnobColor: {
      type: String,
      required: false,
      default: '#00be7e'
    },
    minKnobRadius: {
      type: Number,
      required: false,
      default: null
    },
    minKnobRadiusRel: {
      type: Number,
      required: false,
      default: 7
    },
    maxKnobRadius: {
      type: Number,
      required: false,
      default: null
    },
    maxKnobRadiusRel: {
      type: Number,
      required: false,
      default: 7
    },
    circleWidth: {
      type: Number,
      required: false,
      default: null
    },
    circleWidthRel: {
      type: Number,
      required: false,
      default: 20
    },
    progressWidth: {
      type: Number,
      required: false,
      default: null
    },
    progressWidthRel: {
      type: Number,
      required: false,
      default: 10
    },
    rangeSlider: {
      type: Boolean,
      required: false,
      default: false
    }
    // limitMin: {
    //   type: Number,
    //   required: false,
    //   default: null
    // },
    // limitMax: {
    //   type: Number,
    //   required: false,
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
      currentKnob: ''
    }
  },
  computed: {
    // cpStartAngleOffset () {
    //   if (!this.minStepLimit) {
    //     return 0
    //   }
    // },
    cpStepsLength () {
      return this.steps.length - 1
    },
    cpCenter () {
      return this.side / 2
    },
    cpMinAngle () {
      return this.minAngle + Math.PI / 2
    },
    cpMaxAngle () {
      return this.maxAngle + Math.PI / 2
    },
    cpMainCircleStrokeWidth () {
      return this.circleWidth || (this.side / 2) / this.circleWidthRel
    },
    cpPathDirection () {
      return (this.cpMaxAngle - (this.cpMinAngle - Math.PI / 2) < 3 / 2 * Math.PI) ? 0 : 1
    },
    cpPathX () {
      return this.cpCenter + this.radius * Math.cos(this.cpMaxAngle)
    },
    cpPathY () {
      return this.cpCenter + this.radius * Math.sin(this.cpMaxAngle)
    },
    cpPathStrokeWidth () {
      return this.progressWidth || (this.side / 2) / this.progressWidthRel
    },
    cpMinKnobRadius () {
      return this.minKnobRadius || (this.side / 2) / this.minKnobRadiusRel
    },
    cpMaxKnobRadius () {
      return this.maxKnobRadius || (this.side / 2) / this.maxKnobRadiusRel
    },
    cpPathD () {
      let parts = []
      parts.push('M' + this.cpMinKnobX)
      parts.push(this.cpMinKnobY)
      parts.push('A')
      parts.push(this.radius)
      parts.push(this.radius)
      parts.push(0)
      parts.push(this.cpPathDirection)
      parts.push(1)
      parts.push(this.cpPathX)
      parts.push(this.cpPathY)
      return parts.join(' ')
    },
    cpAngleUnit () {
      return (Math.PI * 2 - this.startAngleOffset) / this.cpStepsLength
    },
    cpMinAngleValue () {
      return (Math.min(
        this.startAngleOffset + this.cpAngleUnit * this.currentMinStepIndex,
        Math.PI * 2 - Number.EPSILON
      )) // - 0.00001 // correct for 100% value
    },
    cpMaxAngleValue () {
      return (Math.min(
        this.startAngleOffset + this.cpAngleUnit * this.currentMaxStepIndex,
        Math.PI * 2 - Number.EPSILON
      )) - 0.00001 // correct for 100% value
    },
    cpCurrentMinStep () {
      return this.steps[this.currentMinStepIndex]
    },
    cpCurrentMaxStep () {
      return this.steps[this.currentMaxStepIndex]
    },
    cpSliderAngle () {
      return (Math.atan2(this.relativeY - this.cpCenter, this.relativeX - this.cpCenter) + Math.PI * 3 / 2) % (Math.PI * 2)
    },
    cpIsTouchWithinSliderRange () {
      const touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.cpCenter), 2) + Math.pow(Math.abs(this.relativeY - this.cpCenter), 2))
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance
    },
    cpMinKnobX () {
      return this.cpCenter + this.radius * Math.cos(this.cpMinAngle)
    },
    cpMinKnobY () {
      return this.cpCenter + this.radius * Math.sin(this.cpMinAngle)
    }
  },
  methods: {
    fitToStep (val) {
      return Math.round(val / this.stepSize) * this.stepSize
    },
    handleClick (e) {
      this.setNewPosition(e)
      if (this.cpIsTouchWithinSliderRange) {
        const newAngle = this.cpSliderAngle
        this.defineCurrentKnob(newAngle)
        
        if (this.currentKnob === 'min') this.animateSlider(this.minAngle, newAngle)
        else if (this.currentKnob === 'max') this.animateSlider(this.maxAngle, newAngle)
      }
    },
    handleMouseDown (e) {
      e.preventDefault()
      this.mousePressed = true

      this.setNewPosition(e)
      if (this.cpIsTouchWithinSliderRange) {
        const newAngle = this.cpSliderAngle
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
      if (this.minAngle >= this.maxAngle) return

      if (this.mousemoveTicks < 5) {
        this.mousemoveTicks++
        return
      }

      this.setNewPosition(e)
      this.updateSlider()
    },
    handleTouchMove (e) {
      this.$emit('touchmove')
      // Do nothing if two or more fingers used
      if (e.targetTouches.length > 1 || e.changedTouches.length > 1 || e.touches.length > 1) {
        return true
      }

      const lastTouch = e.targetTouches.item(e.targetTouches.length - 1)
      this.setNewPosition(lastTouch)

      if (this.cpIsTouchWithinSliderRange) {
        e.preventDefault()
        const newAngle = this.cpSliderAngle
        this.defineCurrentKnob(newAngle)
        this.updateSlider()
      }
    },
    updateMinAngle (angle, isAnimationFinished) {
      this.updateCurrentMinStepFromAngle(angle)
      this.minAngle = this.cpMinAngleValue

      this.currentMinStepValue = this.cpCurrentMinStep
        
      if (isAnimationFinished) {
        this.$emit('inputMin', this.currentMinStepValue) 
      }
    },
    updateMaxAngle (angle, isAnimationFinished) {
      this.updateCurrentMaxStepFromAngle(angle)
      this.maxAngle = this.cpMaxAngleValue

      this.currentMaxStepValue = this.cpCurrentMaxStep

      if (isAnimationFinished) {
        this.$emit('input', this.currentMaxStepValue)
      }
    },
    updateFromPropMinValue (minValue) {
      let previousAngle = this.minAngle
      
      let minStepValue = this.fitToStep(minValue)
      this.updateCurrentMinStepFromValue(minStepValue)

      this.minAngle = this.cpMinAngleValue
      this.currentMinStepValue = minStepValue
      this.animateSlider(previousAngle, this.minAngle)
    },
    updateFromPropMaxValue (maxValue) {
      let previousAngle = this.maxAngle
      
      let maxStepValue = this.fitToStep(maxValue)
      this.updateCurrentMaxStepFromValue(maxStepValue)

      this.maxAngle = this.cpMaxAngleValue
      this.currentMaxStepValue = maxStepValue
      this.animateSlider(previousAngle, this.maxAngle)
    },
    updateSlider () {
      const angle = this.cpSliderAngle
      if ((this.currentKnob === 'max') && (Math.abs(angle - this.maxAngle) < Math.PI))
        this.updateMaxAngle(angle)
      else if ((this.currentKnob === 'min') && (Math.abs(angle - this.minAngle) < Math.PI))
        this.updateMinAngle(angle)
    },
    animateSlider (startAngle, endAngle) {
      const direction = startAngle < endAngle ? 1 : -1
      const curveAngleMovementUnit = (direction * this.cpAngleUnit * 2) / this.stepSize
      
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
          // break
        }
      }
    },
    updateCurrentMinStepFromValue (minValue) {
      for (let i = 0; i < this.cpStepsLength; i++) {
        if (minValue <= this.steps[i]) {
          this.currentMinStepIndex = i
          return
        }
      }
    },
    updateCurrentMaxStepFromValue (maxValue) {
      for (let i = 0; i < this.cpStepsLength; i++) {
        if (maxValue <= this.steps[i]) {
          this.currentMaxStepIndex = i
          return
        }
      }
      this.currentMaxStepIndex = this.cpStepsLength
    },
    updateCurrentMinStepFromAngle (angle) {
      const stepIndex = Math.round((angle - this.startAngleOffset) / this.cpAngleUnit)
      this.currentMinStepIndex = Math.min(Math.max(stepIndex, 0), this.cpStepsLength)
    },
    updateCurrentMaxStepFromAngle (angle) {
      const stepIndex = Math.round((angle - this.startAngleOffset) / this.cpAngleUnit)
      this.currentMaxStepIndex = Math.min(Math.max(stepIndex, 0), this.cpStepsLength)
    },
    setNewPosition (e) {
      const dimensions = this.containerElement.getBoundingClientRect()
      this.relativeX = e.clientX - dimensions.left
      this.relativeY = e.clientY - dimensions.top
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
    },
    setDefaultMinValue () {
      const defaultMinValue = this.currentMaxStepValue
      this.updateFromPropMinValue(defaultMinValue)
      this.$emit('inputMin', defaultMinValue) 
    }
  },
  watch: {
    value (val) {
      if (val === this.currentMaxStepValue) return 
      this.currentKnob = 'max'
      this.updateFromPropMaxValue(val)
    },
    minValue (val) {
      if (!this.rangeSlider || val === this.currentMinStepValue) return 
      this.currentKnob = 'min'
      this.currentMinStepIndex >= this.currentMaxStepIndex ? this.setDefaultMinValue() : this.updateFromPropMinValue(val)
    }
  }
}
</script>
