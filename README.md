# vue-circle-slider

[![npm](https://img.shields.io/npm/v/vue-circle-slider.svg) ![npm](https://img.shields.io/npm/dm/vue-circle-slider.svg)](https://www.npmjs.com/package/vue-circle-slider)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

Circle slider component for Vue.js

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)

# Installation

```
npm install --save vue-circle-slider
```

## Default import

Install all the components:

```javascript
import Vue from 'vue'
import VueCircleSlider from 'vue-circle-slider'

Vue.use(VueCircleSlider)
```

Use specific components:

```javascript
import Vue from 'vue'
import { Test } from 'vue-circle-slider'

Vue.component('test', Test)
```

**⚠️ A css file is included when importing the package. You may have to setup your bundler to embed the css in your page.**

## Distribution import

Install all the components:

```javascript
import 'vue-circle-slider/dist/vue-circle-slider.css'
import VueCircleSlider from 'vue-circle-slider/dist/vue-circle-slider.common'

Vue.use(VueCircleSlider)
```

Use specific components:

```javascript
import 'vue-circle-slider/dist/vue-circle-slider.css'
import { Test } from 'vue-circle-slider/dist/vue-circle-slider.common'

Vue.component('test', Test)
```

**⚠️ You may have to setup your bundler to embed the css file in your page.**

## Browser

```html
<link rel="stylesheet" href="vue-circle-slider/dist/vue-circle-slider.css"/>

<script src="vue.js"></script>
<script src="vue-circle-slider/dist/vue-circle-slider.browser.js"></script>
```

The plugin should be auto-installed. If not, you can install it manually with the instructions below.

Install all the components:

```javascript
Vue.use(VueCircleSlider)
```

Use specific components:

```javascript
Vue.component('test', VueCircleSlider.Test)
```

## Source import

Install all the components:

```javascript
import Vue from 'vue'
import VueCircleSlider from 'vue-circle-slider/src'

Vue.use(VueCircleSlider)
```

Use specific components:

```javascript
import Vue from 'vue'
import { Test } from 'vue-circle-slider/src'

Vue.component('test', Test)
```

**⚠️ You need to configure your bundler to compile `.vue` files.** More info [in the official documentation](https://vuejs.org/v2/guide/single-file-components.html).

# Usage

Plugin will register a global component with name `CircleSlider` so you can just use it right away:

```html
...
<circle-slider v-model="sliderValue"></circle-slider>
...
```

or you can adjust some properties:

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

# Example

- [Working demo](#)
- [Repo](#)

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
