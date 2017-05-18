export default class TouchPosition {
  /*
   */
  constructor (containerElement, sliderRadius, sliderTolerance) {
    this.containerElement = containerElement
    this.sliderRadius = sliderRadius
    this.sliderTolerance = sliderTolerance
    this.setNewPosition({x: 0, y: 0})
  }

  /*
   */
  setNewPosition (e) {
    const dimensions = this.containerElement.getBoundingClientRect()
    const side = dimensions.width
    this.center = side / 2
    this.relativeX = e.x - dimensions.left
    this.relativeY = e.y - dimensions.top
  }

  /*
   */
  get sliderAngle () {
    const angle = (Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + Math.PI * 3 / 2) % (Math.PI * 2)
    return angle
  }

  /*
   */
  get isTouchWithinSliderRange () {
    const touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.center), 2) + Math.pow(Math.abs(this.relativeY - this.center), 2))
    return Math.abs(touchOffset - this.sliderRadius) <= this.sliderTolerance
  }
}
