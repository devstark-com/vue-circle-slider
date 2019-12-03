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
        <circle :fill="knobColor" :r="cpKnobRadius" :cx="cpPathX" :cy="cpPathY"></circle>
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

    this.angle = this.cpAngleValue
    this.currentStepValue = this.cpCurrentStep

    let maxCurveWidth = Math.max(this.cpMainCircleStrokeWidth, this.cpPathStrokeWidth)
    this.radius = (this.side / 2) - Math.max(maxCurveWidth, this.cpKnobRadius * 2) / 2
    this.updateFromPropValue(this.value)
  },
  mounted () {
    this.containerElement = this.$refs._svg
    this.sliderTolerance = this.radius / 2

    this.setInitialPosition()
  },
  props: {
    startPosition: {
      type: Number,
      required: false,
      default: 90 // degrees 
    },
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
    knobColor: {
      type: String,
      required: false,
      default: '#00be7e'
    },
    knobRadius: {
      type: Number,
      required: false,
      default: null
    },
    knobRadiusRel: {
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
      angle: 0,
      currentStepValue: 0,
      mousePressed: false,
      mousemoveTicks: 0,
      currentStepIndex: 0,
      length: 0,
      sliderTolerance: 0,
      relativeX: 0,
      relativeY: 0,
      redundantAngle: 0
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
    cpAngle () {
      return this.angle + this.cpStartPositionRadians
    },
    cpMainCircleStrokeWidth () {
      return this.circleWidth || (this.side / 2) / this.circleWidthRel
    },
    cpPathDirection () {
      return ((this.angle + Math.PI / 2) < 3 / 2 * Math.PI) ? 0 : 1
    },
    cpPathX () {
      return this.cpCenter + this.radius * Math.cos(this.cpAngle)
    },
    cpPathY () {
      return this.cpCenter + this.radius * Math.sin(this.cpAngle)
    },
    cpPathStrokeWidth () {
      return this.progressWidth || (this.side / 2) / this.progressWidthRel
    },
    cpKnobRadius () {
      return this.knobRadius || (this.side / 2) / this.knobRadiusRel
    },
    cpKnobStartX () {
      return this.cpCenter + this.radius * Math.cos(this.cpStartPositionRadians)
    },
    cpKnobStartY () {
      return this.cpCenter + this.radius * Math.sin(this.cpStartPositionRadians)
    },  
    cpPathD () {
      let parts = []
      parts.push('M' + this.cpKnobStartX)
      parts.push(this.cpKnobStartY)
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
    cpAngleValue () {
      return (Math.min(
        this.startAngleOffset + this.cpAngleUnit * this.currentStepIndex,
        Math.PI * 2 - Number.EPSILON
      )) - 0.00001 // correct for 100% value
    },
    cpCurrentStep () {
      return this.steps[this.currentStepIndex]
    },
    cpSliderAngle () {
      return (Math.atan2(this.relativeY - this.cpCenter, this.relativeX - this.cpCenter) + this.cpStartPositionRadians * 3 - this.redundantAngle + this.startAngleOffset) % (Math.PI * 2)
    },
    cpIsTouchWithinSliderRange () {
      const touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.cpCenter), 2) + Math.pow(Math.abs(this.relativeY - this.cpCenter), 2))
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance
    },
    cpStartPositionRadians () {
      return this.startPosition / 180 * Math.PI
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
        this.animateSlider(this.angle, newAngle)
      }
    },
    handleMouseDown (e) {
      e.preventDefault()
      this.mousePressed = true
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
        this.updateSlider()
      }
    },
    updateAngle (angle, isAnimationFinished) {
      this.updateCurrentStepFromAngle(angle)
      this.angle = this.cpAngleValue
      this.currentStepValue = this.cpCurrentStep

      if (isAnimationFinished) {
        this.$emit('input', this.currentStepValue)
      }
    },
    updateFromPropValue (value) {
      let previousAngle = this.angle
      
      let stepValue = this.fitToStep(value)
      this.updateCurrentStepFromValue(stepValue)

      this.angle = this.cpAngleValue
      this.currentStepValue = stepValue
      this.animateSlider(previousAngle, this.angle)
    },
    updateSlider () {
      const angle = this.cpSliderAngle
      if (Math.abs(angle - this.angle) < Math.PI) {
        this.updateAngle(angle)
      }
    },
    animateSlider (startAngle, endAngle) {
      const direction = startAngle < endAngle ? 1 : -1
      const curveAngleMovementUnit = (direction * this.cpAngleUnit * 2) / this.stepSize

      const animate = () => {
        if (Math.abs(endAngle - startAngle) < Math.abs(2 * curveAngleMovementUnit)) {
          this.updateAngle(endAngle, true)
        } else {
          const newAngle = startAngle + curveAngleMovementUnit
          this.updateAngle(newAngle, false)
          this.animateSlider(newAngle, endAngle)
        }
      }

      window.requestAnimationFrame(animate)
    },
    defineInitialCurrentStepIndex () {
      for (let stepIndex in this.steps) {
        if (this.steps[stepIndex] === this.value) {
          this.currentStepIndex = stepIndex
          break
        }
      }
    },
    updateCurrentStepFromValue (value) {
      for (let i = 0; i < this.cpStepsLength; i++) {
        if (value <= this.steps[i]) {
          this.currentStepIndex = i
          return
        }
      }

      this.currentStepIndex = this.cpStepsLength
    },
    updateCurrentStepFromAngle (angle) {
      const stepIndex = Math.round((angle - this.startAngleOffset) / this.cpAngleUnit)
      this.currentStepIndex = Math.min(Math.max(stepIndex, 0), this.cpStepsLength)
    },
    setNewPosition (e) {
      const dimensions = this.containerElement.getBoundingClientRect()
      this.relativeX = ( e.clientX || e.x ) - dimensions.left
      this.relativeY = ( e.clientY || e.y ) - dimensions.top

      this.calculateRedundantAngle()
    },
    calculateRedundantAngle () {
      const totalAngle = Math.atan2(this.relativeY - this.cpCenter, this.relativeX - this.cpCenter) + this.cpStartPositionRadians * 3
      
      if ((this.cpStartPositionRadians !== Math.PI / 2) && !this.redundantAngle) {
        this.redundantAngle = totalAngle - (Math.PI * 2)
      }
    },
    setInitialPosition () {
      const dimensions = this.containerElement.getBoundingClientRect()
      const x = (this.cpPathX + dimensions.left).toFixed(0)
      const y = (this.cpPathY + dimensions.top).toFixed(0)

      this.setNewPosition({x, y})
    }
  },
  watch: {
    value (val) {
      if (val === this.currentStepValue) return 
      this.updateFromPropValue(val)
    }
  }
}
</script>
