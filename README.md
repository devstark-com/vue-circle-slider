# vue-circle-slider

[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![build](https://img.shields.io/wercker/ci/wercker/docs.svg)](https://github.com/vuedev-com/vue-circle-slider)
[![npm](https://img.shields.io/npm/v/vue-circle-slider.svg) ![npm](https://img.shields.io/npm/dm/vue-circle-slider.svg)](https://www.npmjs.com/package/vue-circle-slider)
[![build](https://img.shields.io/npm/l/express.svg)](https://github.com/vuedev-com/vue-circle-slider)

Circle slider component for Vue.js

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Demo](#demo)
- [TODO intentions](#todo)
- [Credits](#credits)

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
  :stepSize="100"
  :circleWidthRel="20"
  :progressWidthRel="10"
  :knobRadius="10"
></circle-slider>
...
```

## Interface

### Props

| Props            | Type          | Default  | Description  |
| ---------------- |:--------------| ---------|--------------|
| side             | Number        | 100      | size of a side of a svg square in px |
| min              | Number        | 0        | the minimum value |
| max              | Number        | 100      | the maximum value |
| stepSize         | Number        | 1        | the gap between the values |
| circleColor      | String        | `#334860`| color of slider circumference |
| progressColor    | String        | `#00be7e`| color of progress curve |
| knobColor        | String        | `#00be7e`| knob color |
| knobRadius       | Number        | null     | exact knob radius in px |
| knobRadiusRel    | Number        | 7        | relative knob radius. will be calculated as `(side/2) / knobRadiusRel` |
| circleWidth      | Number        | null     | exact width of circle in px |
| circleWidthRel   | Number        | 20       | relative circle width. will be calculated as `(side/2) / circleWidthRel` |
| progressWidth    | Number        | null     | exact progress curve width in px |
| progressWidthRel | Number        | 10       | relative progress curve width. will be calculated as `(side/2) / progressWidthRel` |

### Events

| Name          | Params        | Description  |
| --------------|:--------------|--------------|
| touchmove     | none          | fires on touch devices |

### Slots

There is no any slots yet


# Demo

- [Working demo](#)
- [Repo](#)

# TODO

- add plugin options for defining custom defaults via `Vue.use(VueCircleSlider, options)`
  - globalComponent[Boolean] - enable/disable global component registration
  - componentName[String] - ability to define custom name for component
  - options with defaults for all props (with same names)
- add `limitMin` and `limitMax` props to limit an accessible slider range

# Credits

Built with [vue-share-components](https://github.com/Akryum/vue-share-components) by [Akryum](https://github.com/Akryum)

---

# Plugin Development

## Installation

The first time you create or clone your plugin, you need to install the default dependencies:

```
npm install
```

## Watch and compile

This will run webpack in watching mode and output the compiled files in the `dist` folder.

```
npm run dev
```

## Use it in another project

While developping, you can follow the install instructions of your plugin and link it into the project that uses it.

In the plugin folder:

```
npm link
```

In the other project folder:

```
npm link vue-circle-slider
```

This will install it in the dependencies as a symlink, so that it gets any modifications made to the plugin.

## Publish to npm

You may have to login to npm before, with `npm adduser`. The plugin will be built in production mode before getting published on npm.

```
npm publish
```

## Manual build

This will build the plugin into the `dist` folder in production mode.

```
npm run build
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
