export default class CircleSliderState {
  /*
   */
  constructor (steps, offset, initialValue) {
    this.steps = steps
    this.offset = offset
    this.currentStepIndex = 0
    for (let stepIndex in this.steps) {
      if (this.steps[stepIndex] === initialValue) {
        this.currentStepIndex = stepIndex
        break
      }
    }
    this.firstStep = this.steps[0]
    this.lastStep = this.steps[this.steps.length - 1]
    this.length = this.steps.length
  }

  /*
   */
  get angleUnit () {
    return (Math.PI * 2 - this.offset) / this.length
  }

  /*
   */
  get angleValue () {
    return Math.min(
      this.offset + this.angleUnit * this.currentStepIndex,
      Math.PI * 2 - Number.EPSILON
    )
  }

  /*
   */
  get currentStep () {
    return this.steps[this.currentStepIndex]
  }

  /*
   */
  updateCurrentStepFromValue (value) {
    for (let i = 0; i < this.length; i++) {
      if (value <= this.steps[i]) {
        this.currentStepIndex = i
        return
      }
    }

    this.currentStepIndex = this.length - 1
  }

  /*
   */
  updateCurrentStepFromAngle (angle) {
    const stepIndex = Math.floor((angle - this.offset) / this.angleUnit)
    this.currentStepIndex = Math.min(Math.max(stepIndex, 0), (this.length - 1))
  }
}
