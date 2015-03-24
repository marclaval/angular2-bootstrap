import {Component, Template, Decorator, NgElement, Ancestor, For} from 'angular2/angular2';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {EventEmitter} from 'angular2/src/core/annotations/di';

@Component({
  selector: 'carousel',
  bind : {
    'index': 'index',
    'wrap': 'wrap',
    'interval': 'interval',
    'pause': 'pause'
  },
  events: {
    'mouseenter': 'toggleOnHover()',
    'mouseleave': 'toggleOnHover()'
  }
})
@Template({
  url: './carousel/carousel.html',
  directives: [For]
})
export class Carousel {
  constructor(@EventEmitter('indexchange') emitter:Function) {
    this.emitter = emitter;
    this.activeIndex = -1;
    this.slides = [];
    this.wrap = true;
    this._interval = 5000;
    this.pause = "hover",
    this.timerId = null;
    this.transitionEnd = this.noTransition ? false : getTransitionEnd();
    this._isToRight = true;
    this._isChangingSlide = false;
    this._startCycling();
  }
  set index(newValue) {
    if (!this._isChangingSlide && newValue != this.activeIndex && newValue >= 0 && newValue <= this.slides.length - 1) {
      this._isChangingSlide = true;
      var currentSlide = this.slides[this.activeIndex];
      var nextSlide = this.slides[newValue];
      if (this.activeIndex == -1) {
        this._finalizeTransition(null, nextSlide, newValue);
      } else if (this.transitionEnd) {
        nextSlide.prepareAnimation(this._isToRight ? "next" : "prev");
        setTimeout(() => {
          currentSlide.animate(this._isToRight ? "left" : "right");
          nextSlide.animate(this._isToRight ? "left" : "right");
          var endAnimationCallback = (event) => {
            currentSlide.el.domElement.removeEventListener(this.transitionEnd, endAnimationCallback, false);
            this._finalizeTransition(currentSlide, nextSlide, newValue);
          };
          currentSlide.el.domElement.addEventListener(this.transitionEnd, endAnimationCallback, false);
        }, 30);
      } else {
        this._finalizeTransition(currentSlide, nextSlide, newValue);
      }
    }
  }
  _finalizeTransition(currentSlide, nextSlide, newValue) {
    if (currentSlide) {
      currentSlide.deactivate();
      currentSlide.cleanAfterAnimation();
    }
    nextSlide.activate();
    nextSlide.cleanAfterAnimation();
    this.activeIndex = newValue;
    this._isChangingSlide = false;
    this.emitter(this.activeIndex);
  }
  set interval(newValue) {
    this._interval = newValue;
    this._stopCycling();
    this._startCycling();
  }
  registerSlide(slide: Slide) {
    this.slides.push(slide);
  }
  navigateTo(newIndex) {
    this._isToRight = newIndex > this.activeIndex;
    this.index = newIndex;
  }
  prev() {
    if (this.hasPrev()) {
      var prevIndex = this.activeIndex - 1 < 0 ? this.slides.length - 1 : this.activeIndex - 1;
      this._isToRight = false;
      this.index = prevIndex;
    }
  }
  next() {
    if (this.hasNext()) {
      var nextIndex = (this.activeIndex + 1) % this.slides.length;
      this._isToRight = true;
      this.index = nextIndex;
    }
  }
  hasPrev() {
    return this.slides.length > 1 &&  !(!this.wrap && this.activeIndex === 0);
  }
  hasNext() {
    return this.slides.length > 1 && !(!this.wrap && this.activeIndex === (this.slides.length - 1));
  }
  _startCycling() {
    if (this._interval >= 0) {
      this.timerId = setInterval(() => {
        this.next();
      }, this._interval > 600 ? this._interval: 600); //600ms is the transition duration defined in BS css
    }
  }
  _stopCycling() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = null;
  }
  toggleOnHover() {
    if (this.pause === "hover") {
      if (this.timerId) {
        this._stopCycling();
      } else {
        this._startCycling();
      }
    }
  }
}

@Component({
  selector: 'carousel-slide'
})
@Template({
  inline: '<content></content>'
})
export class CarouselSlide {
  constructor(el: NgElement, @Ancestor() carousel: Carousel) {
    this.el = el;
    DOM.addClass(el.domElement, "item");
    this.index = carousel.slides.length;
    carousel.registerSlide(this);
  }
  activate() {
    DOM.addClass(this.el.domElement, "active");
  }
  deactivate(){
    DOM.removeClass(this.el.domElement, "active");
  }
  prepareAnimation(className) {
    DOM.addClass(this.el.domElement, className);
  }
  animate(className) {
    DOM.addClass(this.el.domElement, className);
  }
  cleanAfterAnimation() {
    DOM.removeClass(this.el.domElement, "left");
    DOM.removeClass(this.el.domElement, "next");
    DOM.removeClass(this.el.domElement, "right");
    DOM.removeClass(this.el.domElement, "prev");
  }
}

@Component({
  selector: 'carousel-caption'
})
@Template({
  inline: '<content></content>'
})
export class CarouselCaption {
  constructor(el: NgElement) {
    DOM.addClass(el.domElement, "carousel-caption");
  }
}

// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
// ============================================================
function getTransitionEnd() {
    var el = document.createElement('angular2-bootstrap');
    var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
    };
    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return transEndEventNames[name];
        }
    }
    return false;
}
