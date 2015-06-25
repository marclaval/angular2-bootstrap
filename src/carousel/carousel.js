import {ComponentAnnotation as Component, ViewAnnotation as View, DirectiveAnnotation as Directive, ElementRef, AncestorAnnotation as Ancestor, NgFor, onDestroy} from 'angular2/angular2';
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';

@Component({
  selector: 'carousel',
  properties : [
    'index',
    'wrap',
    'interval',
    'pause',
    'noTransition: no-transition'
  ],
  host: {
    '(mouseenter)': 'toggleOnHover()',
    '(mouseleave)': 'toggleOnHover()'
  },
  events: ['indexchange', 'slidestart', 'slideend']
})
@View({
  templateUrl: './carousel/carousel.html',
  directives: [NgFor]
})
export class Carousel {
  indexchange: EventEmitter;
  slidestart: EventEmitter;
  slideend: EventEmitter;

  constructor() {
    this.indexchange = new EventEmitter();
    this.slidestart = new EventEmitter();
    this.slideend = new EventEmitter();
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
      if (this._isToRight == null) {
        this._isToRight = newValue > this.activeIndex;
      }
      this.slidestart.next()
      var currentSlide = this.slides[this.activeIndex];
      var nextSlide = this.slides[newValue];
      if (this.activeIndex == -1) {
        this._finalizeTransition(null, nextSlide, newValue);
      } else if (!this.noTransition && this.transitionEnd && currentSlide) {
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
    this.activeIndex = parseInt(newValue);
    this._isChangingSlide = false;
    this._isToRight = null;
    this.slideend.next();
    this.indexchange.next(this.activeIndex);
  }
  set interval(newValue) {
    this._interval = newValue;
    this._stopCycling();
    this._startCycling();
  }
  registerSlide(slide: Slide, slideIndex) {
    var activeSlide = this.slides[this.activeIndex];
    this.slides.splice(slideIndex, 0, slide);
    if (activeSlide) {
      var newIndex = this.slides.indexOf(activeSlide);
      if (newIndex != this.activeIndex) {
        this.activeIndex = newIndex;
        this.indexchange.next(this.activeIndex);
      }
    }
    this._resetAfterSlidesChange();
  }
  unregisterSlide(slide: Slide) {
    var index = this.slides.indexOf(slide);
    if (index > -1) {
      var activeSlide = this.slides[this.activeIndex];
      slide.deactivate();
      slide.cleanAfterAnimation();
      this.slides.splice(index, 1);
      if (activeSlide == slide) {
        var activeIndex = this.activeIndex;
        this.activeIndex = -1;
        this.index = activeIndex < this.slides.length ? activeIndex : this.slides.length - 1;
      } else {
        var newIndex = this.slides.indexOf(activeSlide);
        if (newIndex != this.activeIndex) {
          this.activeIndex = newIndex;
          this.indexChangeEmitter(this.activeIndex);
        }
      }
    }
    this._resetAfterSlidesChange();
  }
  _resetAfterSlidesChange() {
    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];
      slide.deactivate();
      slide.cleanAfterAnimation();
      if (i == this.activeIndex) {
        slide.activate();
      }
    }
    this._isChangingSlide = false;
    this._isToRight = null;
  }
  navigateTo(newIndex) {
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
  _fireEvent(msg: string, value: any) {
    ObservableWrapper.callNext(this.eventEmitter, msg, value);
  }
}

@Directive({
  selector: 'carousel-slide',
  lifecycle: [onDestroy],
  host: {
    '[class.item]': 'itemClass',
    '[class.active]': 'activeClass',
    '[class.left]': 'leftClass',
    '[class.right]': 'rightClass',
    '[class.prev]': 'prevClass',
    '[class.next]': 'nextClass',
    'role': 'listbox'
  }
})
export class CarouselSlide {
  constructor(el: ElementRef, @Ancestor() carousel: Carousel) {
    this.carousel = carousel;
    this.el = el.nativeElement;
    this.activate = () => {this.activeClass = true};
    this.deactivate = () => {this.activeClass = false};
    this.prepareAnimation = (isToRight) => {isToRight ? this.nextClass = true : this.prevClass = true};
    this.animate = (isToRight) => {isToRight ? this.leftClass = true : this.rightClass = true};
    this.cleanAfterAnimation = () => {this.leftClass = false; this.rightClass = false; this.nextClass = false; this.prevClass = false};

    //TODO later: var slideIndex = [].indexOf.call(this.el.parentNode.querySelectorAll('carousel-slide'), this.el);
    var slideIndex = this.carousel.slides.length;
    carousel.registerSlide(this, slideIndex);
    this.itemClass = true;
  }
  getElement() {
    return this.el;
  }
  onDestroy() {
    this.carousel.unregisterSlide(this);
  }
}

@Directive({
  selector: 'carousel-caption',
  host: {
    '[class.carousel-caption]': 'carouselCaptionClass'
  }
})
export class CarouselCaption {
  constructor() {
    this.carouselCaptionClass = true;
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
