/*!
 * vue-circle-slider v0.1.0 
 * (c) 2019 
 * Released under the undefined License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'CircleSlider',
  created: function created() {
    var _this = this;

    this.stepsCount = 1 + (this.max - this.min) / this.stepSize;
    this.steps = Array.from({
      length: this.stepsCount
    }, function (_, i) {
      return _this.min + i * _this.stepSize;
    });
    this.defineInitialCurrentStepIndex();
    this.angle = this.cpAngleValue;
    this.currentStepValue = this.cpCurrentStep;
    var maxCurveWidth = Math.max(this.cpMainCircleStrokeWidth, this.cpPathStrokeWidth);
    this.radius = this.side / 2 - Math.max(maxCurveWidth, this.cpKnobRadius * 2) / 2;
    this.updateFromPropValue(this.value);
  },
  mounted: function mounted() {
    this.containerElement = this.$refs._svg;
    this.sliderTolerance = this.radius / 2;
    this.setNewPosition({
      x: 0,
      y: 0
    });
  },
  props: {
    startAngleOffset: {
      type: Number,
      required: false,
      default: function _default() {
        // return Math.PI / 20
        return 0;
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
    } // limitMin: {
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
  data: function data() {
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
      relativeY: 0
    };
  },
  computed: {
    // cpStartAngleOffset () {
    //   if (!this.minStepLimit) {
    //     return 0
    //   }
    // },
    cpStepsLength: function cpStepsLength() {
      return this.steps.length - 1;
    },
    cpCenter: function cpCenter() {
      return this.side / 2;
    },
    cpAngle: function cpAngle() {
      return this.angle + Math.PI / 2;
    },
    cpMainCircleStrokeWidth: function cpMainCircleStrokeWidth() {
      return this.circleWidth || this.side / 2 / this.circleWidthRel;
    },
    cpPathDirection: function cpPathDirection() {
      return this.cpAngle < 3 / 2 * Math.PI ? 0 : 1;
    },
    cpPathX: function cpPathX() {
      return this.cpCenter + this.radius * Math.cos(this.cpAngle);
    },
    cpPathY: function cpPathY() {
      return this.cpCenter + this.radius * Math.sin(this.cpAngle);
    },
    cpPathStrokeWidth: function cpPathStrokeWidth() {
      return this.progressWidth || this.side / 2 / this.progressWidthRel;
    },
    cpKnobRadius: function cpKnobRadius() {
      return this.knobRadius || this.side / 2 / this.knobRadiusRel;
    },
    cpPathD: function cpPathD() {
      var parts = [];
      parts.push('M' + this.cpCenter);
      parts.push(this.cpCenter + this.radius);
      parts.push('A');
      parts.push(this.radius);
      parts.push(this.radius);
      parts.push(0);
      parts.push(this.cpPathDirection);
      parts.push(1);
      parts.push(this.cpPathX);
      parts.push(this.cpPathY);
      return parts.join(' ');
    },
    cpAngleUnit: function cpAngleUnit() {
      return (Math.PI * 2 - this.startAngleOffset) / this.cpStepsLength;
    },
    cpAngleValue: function cpAngleValue() {
      return Math.min(this.startAngleOffset + this.cpAngleUnit * this.currentStepIndex, Math.PI * 2 - Number.EPSILON) - 0.00001; // correct for 100% value
    },
    cpCurrentStep: function cpCurrentStep() {
      return this.steps[this.currentStepIndex];
    },
    cpSliderAngle: function cpSliderAngle() {
      return (Math.atan2(this.relativeY - this.cpCenter, this.relativeX - this.cpCenter) + Math.PI * 3 / 2) % (Math.PI * 2);
    },
    cpIsTouchWithinSliderRange: function cpIsTouchWithinSliderRange() {
      var touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.cpCenter), 2) + Math.pow(Math.abs(this.relativeY - this.cpCenter), 2));
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance;
    }
  },
  methods: {
    fitToStep: function fitToStep(val) {
      return Math.round(val / this.stepSize) * this.stepSize;
    },
    handleClick: function handleClick(e) {
      this.setNewPosition(e);

      if (this.cpIsTouchWithinSliderRange) {
        var newAngle = this.cpSliderAngle;
        this.animateSlider(this.angle, newAngle);
      }
    },
    handleMouseDown: function handleMouseDown(e) {
      e.preventDefault();
      this.mousePressed = true;
      window.addEventListener('mousemove', this.handleWindowMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp: function handleMouseUp(e) {
      e.preventDefault();
      this.mousePressed = false;
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      this.mousemoveTicks = 0;
    },
    handleWindowMouseMove: function handleWindowMouseMove(e) {
      e.preventDefault();

      if (this.mousemoveTicks < 5) {
        this.mousemoveTicks++;
        return;
      }

      this.setNewPosition(e);
      this.updateSlider();
    },
    handleTouchMove: function handleTouchMove(e) {
      this.$emit('touchmove'); // Do nothing if two or more fingers used

      if (e.targetTouches.length > 1 || e.changedTouches.length > 1 || e.touches.length > 1) {
        return true;
      }

      var lastTouch = e.targetTouches.item(e.targetTouches.length - 1);
      this.setNewPosition(lastTouch);

      if (this.cpIsTouchWithinSliderRange) {
        e.preventDefault();
        this.updateSlider();
      }
    },
    updateAngle: function updateAngle(angle) {
      var isAnimationFinished = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.updateCurrentStepFromAngle(angle);
      this.angle = this.cpAngleValue;
      this.currentStepValue = this.cpCurrentStep;

      if (isAnimationFinished) {
        this.$emit('input', this.currentStepValue);
      }
    },
    updateFromPropValue: function updateFromPropValue(value) {
      var stepValue = this.fitToStep(value);
      this.updateCurrentStepFromValue(stepValue);
      this.angle = this.cpAngleValue;
      this.currentStepValue = stepValue;
      this.$emit('input', this.currentStepValue);
    },
    updateSlider: function updateSlider() {
      var angle = this.cpSliderAngle;

      if (Math.abs(angle - this.angle) < Math.PI) {
        this.updateAngle(angle);
      }
    },
    animateSlider: function animateSlider(startAngle, endAngle) {
      var _this2 = this;

      var direction = startAngle < endAngle ? 1 : -1;
      var curveAngleMovementUnit = direction * this.cpAngleUnit * 2;

      var animate = function animate() {
        if (Math.abs(endAngle - startAngle) < Math.abs(2 * curveAngleMovementUnit)) {
          _this2.updateAngle(endAngle, true);
        } else {
          var newAngle = startAngle + curveAngleMovementUnit;

          _this2.updateAngle(newAngle, false);

          _this2.animateSlider(newAngle, endAngle);
        }
      };

      window.requestAnimationFrame(animate);
    },
    defineInitialCurrentStepIndex: function defineInitialCurrentStepIndex() {
      for (var stepIndex in this.steps) {
        if (this.steps[stepIndex] === this.value) {
          this.currentStepIndex = stepIndex;
          break;
        }
      }
    },
    updateCurrentStepFromValue: function updateCurrentStepFromValue(value) {
      for (var i = 0; i < this.cpStepsLength; i++) {
        if (value <= this.steps[i]) {
          this.currentStepIndex = i;
          return;
        }
      }

      this.currentStepIndex = this.cpStepsLength;
    },
    updateCurrentStepFromAngle: function updateCurrentStepFromAngle(angle) {
      var stepIndex = Math.round((angle - this.startAngleOffset) / this.cpAngleUnit);
      this.currentStepIndex = Math.min(Math.max(stepIndex, 0), this.cpStepsLength);
    },
    setNewPosition: function setNewPosition(e) {
      var dimensions = this.containerElement.getBoundingClientRect();
      this.relativeX = e.clientX - dimensions.left;
      this.relativeY = e.clientY - dimensions.top;
    }
  },
  watch: {
    value: function value(val) {
      if (val === this.currentStepValue) return;
      this.updateFromPropValue(val);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('svg',{ref:"_svg",attrs:{"width":_vm.side + 'px',"height":_vm.side + 'px',"viewBox":'0 0 ' + _vm.side + ' ' + _vm.side},on:{"touchmove":_vm.handleTouchMove,"click":_vm.handleClick,"mousedown":_vm.handleMouseDown,"mouseup":_vm.handleMouseUp}},[_c('g',[_c('circle',{attrs:{"stroke":_vm.circleColor,"fill":"none","stroke-width":_vm.cpMainCircleStrokeWidth,"cx":_vm.cpCenter,"cy":_vm.cpCenter,"r":_vm.radius}}),_vm._v(" "),_c('path',{attrs:{"stroke":_vm.progressColor,"fill":"none","stroke-width":_vm.cpPathStrokeWidth,"d":_vm.cpPathD}}),_vm._v(" "),_c('circle',{attrs:{"fill":_vm.knobColor,"r":_vm.cpKnobRadius,"cx":_vm.cpPathX,"cy":_vm.cpPathY}})])])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var CircleSlider = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var VERSION = '0.1.0'; // Install the components

function install(Vue) {
  Vue.component('circle-slider', CircleSlider);
  /* -- Add more components here -- */
} // Expose the components
/* -- Plugin definition & Auto-install -- */

/* You shouldn't have to modify the code below */
// Plugin

var plugin = {
  /* eslint-disable no-undef */
  version: VERSION,
  install: install
};

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

exports.CircleSlider = CircleSlider;
exports.default = plugin;
exports.install = install;
