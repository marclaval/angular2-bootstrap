import {Component, Template, Decorator, NgElement, Ancestor, For} from 'angular2/angular2';
import {EventEmitter, PropertySetter} from 'angular2/src/core/annotations/di';

@Component({
  selector: 'carousel',
  bind : {
    'index': 'index',
    'wrap': 'wrap',
    'interval': 'interval',
    'pause': 'pause',
    'noTransition': 'no-transition'
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
  constructor(@EventEmitter('indexchange') indexChangeEmitter:Function,
    @EventEmitter('slidestart') slidestartEmitter:Function,
    @EventEmitter('slideend') slideendEmitter:Function) {
    this.indexChangeEmitter = indexChangeEmitter;
    this.slidestartEmitter = slidestartEmitter;
    this.slideendEmitter = slideendEmitter;
    this.activeIndex = -1;
    this.slides = [];
    this.wrap = true;
    this._interval = 5000;
    this.pause = "hover",
    this.timerId = null;
    this.noTransition = false;
    this.transitionEnd = getTransitionEnd();
    this._isToRight = true;
    this._isChangingSlide = false;
    this._startCycling();
  }
  set index(newValue) {
    if (!this._isChangingSlide && newValue != this.activeIndex && newValue >= 0 && newValue <= this.slides.length - 1) {
      this._isChangingSlide = true;
      this.slidestartEmitter();
      var currentSlide = this.slides[this.activeIndex];
      var nextSlide = this.slides[newValue];
      if (this.activeIndex == -1) {
        this._finalizeTransition(null, nextSlide, newValue);
      } else if (!this.noTransition && this.transitionEnd) {
        nextSlide.prepareAnimation(this._isToRight);
        setTimeout(() => {
          currentSlide.animate(this._isToRight);
          nextSlide.animate(this._isToRight);
          var endAnimationCallback = (event) => {
            currentSlide.getElement().removeEventListener(this.transitionEnd, endAnimationCallback, false);
            this._finalizeTransition(currentSlide, nextSlide, newValue);
          };
          currentSlide.getElement().addEventListener(this.transitionEnd, endAnimationCallback, false);
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
    this.slideendEmitter();
    this.indexChangeEmitter(this.activeIndex);
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

@Decorator({
  selector: 'carousel-slide'
})
export class CarouselSlide {
  constructor(el: NgElement, @Ancestor() carousel: Carousel,
    @PropertySetter('class.active') activeSetter: Function, @PropertySetter('class.item') itemSetter: Function,
    @PropertySetter('class.left') leftSetter: Function, @PropertySetter('class.right') rightSetter: Function,
    @PropertySetter('class.prev') prevSetter: Function, @PropertySetter('class.next') nextSetter: Function,
    @PropertySetter('attr.role') roleSetter: Function) {
    this.el = el.domElement;
    this.index = carousel.slides.length;
    carousel.registerSlide(this);
    itemSetter(true);
    roleSetter("listbox");
    this.activate = () => {activeSetter(true)};
    this.deactivate = () => {activeSetter(false)};
    this.prepareAnimation = (isToRight) => {isToRight ? nextSetter(true) : prevSetter(true)};
    this.animate = (isToRight) => {isToRight ? leftSetter(true) : rightSetter(true)};
    this.cleanAfterAnimation = () => {leftSetter(false); rightSetter(false); nextSetter(false); prevSetter(false)};
  }
  getElement() {
    return this.el;
  }
}

@Decorator({
  selector: 'carousel-caption'
})
export class CarouselCaption {
  constructor(@PropertySetter('class.carousel-caption') captionSetter: Function) {
    captionSetter(true);
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
