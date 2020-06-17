# vue-circle-slider

[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![build](https://img.shields.io/wercker/ci/wercker/docs.svg)](https://github.com/devstark-com/vue-circle-slider)
[![npm](https://img.shields.io/npm/v/vue-circle-slider.svg) ![npm](https://img.shields.io/npm/dm/vue-circle-slider.svg)](https://www.npmjs.com/package/vue-circle-slider)
[![build](https://img.shields.io/npm/l/express.svg)](https://github.com/devstark-com/vue-circle-slider)

Circle slider component for Vue.js

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Demo](#demo)
- [TODO intentions](#todo)

# Installation

```
npm install --save vue-circle-slider
```

## Adding into app

```javascript
import Vue from 'vue'
import VueCircleSlider from 'vue-circle-slider'

Vue.use(VueCircleSlider)
```

# Usage

## Functionality

- svg based view
- binding via `v-model`
- defining min & max values
- limitation of accessible slider range with `limitMin` and `limitMax`
- defining step size
- animation while updating to new value
- touch devices support (`touchmove`)
- sizes customization: exact and relative definitions
- colors customization
- counterclockwise direction of the circle slider
- mousewheel/touchpad scroll detection
- positioning starting point of the slider at any position on the circle
- range slider with min/max values


## Examples

Plugin will register a global component with name `CircleSlider` so you can just use it right away:

```html
...
<circle-slider v-model="sliderValue"></circle-slider>
...
```

or customize some properties:

```html
...
<circle-slider
  v-model="sliderValue"
  :side="150"
  :min="0"
  :max="10000"
  :step-size="100"
  :circle-width-rel="20"
  :progress-width-rel="10"
  :max-knob-radius="10"
></circle-slider>
...
```

## Interface

### Props

| Props            | Type          | Default  | Description  |
| ---------------- |:--------------| ---------|--------------|
| side             | Number        | 100      | size of a side of a svg square in px |
| min              | Number        | 0        | the minimum value |
| max              | Number        | 100      | the maximum value |
| stepSize         | Number        | 1        | the gap between the values |
| circleColor      | String        | `#334860`| color of slider circumference |
| progressColor    | String        | `#00be7e`| color of progress curve |
| circleWidth      | Number        | null     | exact width of circle in px |
| circleWidthRel   | Number        | 20       | relative circle width. width value in px will be calculated as `(side/2) / circleWidthRel` |
| progressWidth    | Number        | null     | exact progress curve width in px |
| progressWidthRel | Number        | 10       | relative progress curve width. width value in px will be calculated as `(side/2) / progressWidthRel` |
| startAngleOffset | Number        | 90       | angle in degrees (from 0 to 360) at which to place "zero" position of the slider |
| counterClockwise | Boolean       | false    | changes the direction of the slider to counter-clockwise |
| rangeSlider      | Boolean       | false    | turns the slider into a range-slider with "min" and "max" knobs/values |
| limitMin         | Number        | 0        | value that "min" knob can't be less than |
| limitMax         | Number        | 100      | value that "max" knob can't be greater than |
| minKnobColor     | String        | `#00be7e`| "min" knob color |
| maxKnobColor     | String        | `#00be7e`| "max" knob color |
| minKnobRadius    | Number        | null     | exact "min" knob radius in px |
| maxKnobRadius    | Number        | null     | exact "max" knob radius in px |
| minKnobRadiusRel | Number        | 7        | relative "min" knob radius. Radius value in px will be calculated as `(side/2) / minKnobRadiusRel` |
| maxKnobRadiusRel | Number        | 7        | relative "max" knob radius. Radius value in px will be calculated as `(side/2) / maxKnobRadiusRel` |
| debouceInput     | Number        | 1000     | number of milliseconds to wait after user stops typing in input element, allows getting final input value |
| throttleScroll   | Number        | 30       | rate in milliseconds at which to handle value coming from mousewheel/touchpad scrolling |
 

### Events

| Name          | Params        | Description              |
| --------------|:--------------|--------------------------|
| input         | none          | fires on value change    |
| touchmove     | none          | fires on touch devices   |

### Slots

There are no slots available


# Demo

- [Working demo](https://devstark-com.github.io/vue-circle-slider-demo/)
- [Demo sources](https://github.com/devstark-com/vue-circle-slider-demo/)

# TODO

- add plugin options for defining custom defaults via `Vue.use(VueCircleSlider, options)`
  - globalComponent[Boolean] - enable/disable global component registration
  - componentName[String] - ability to define custom name for component
  - options with defaults for all props (with same names)

---

## License

[MIT](http://opensource.org/licenses/MIT)