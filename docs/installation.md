# Installation

## Direct Download / CDN

https://unpkg.com/vue-circle-slider/dist/vue-circle-slider 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue-circle-slider@{{ $version }}/dist/vue-circle-slider.js
 
Include vue-circle-slider after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-circle-slider/dist/vue-circle-slider.js"></script>
```

## NPM

```sh
$ npm install vue-circle-slider
```

## Yarn

```sh
$ yarn add vue-circle-slider
```

When used with a module system, you must explicitly install the `vue-circle-slider` via `Vue.use()`:

```javascript
import Vue from 'vue'
import vue-circle-slider from 'vue-circle-slider'

Vue.use(vue-circle-slider)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-circle-slider` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com//vue-circle-slider.git node_modules/vue-circle-slider
$ cd node_modules/vue-circle-slider
$ npm install
$ npm run build
```

