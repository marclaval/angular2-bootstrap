/// <reference path="../../typings/tsd.d.ts" />
import {Component, View, Directive, ElementRef, Query, QueryList, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

@Directive({
  selector: 'carousel-slide',
  host: {
    '[class.item]': '_itemClass',
    '[class.active]': '_activeClass',
    '[class.left]': '_leftClass',
    '[class.right]': '_rightClass',
    '[class.prev]': '_prevClass',
    '[class.next]': '_nextClass',
    'role': 'listbox'
  }
})
export class CarouselSlide {
  private _el: HTMLElement;
  private _itemClass: boolean = true;
  private _activeClass: boolean;
  private _leftClass: boolean;
  private _rightClass: boolean;
  private _prevClass: boolean;
  private _nextClass: boolean;
  
  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }
  getElement(): HTMLElement {
    return this._el;
  }
  activate(): void {this._activeClass = true;}
  deactivate(): void {this._activeClass = false;}
  prepareAnimation(isToRight: boolean): void {
    isToRight ? this._nextClass = true : this._prevClass = true;
  }
  animate(isToRight: boolean): void {
    isToRight ? this._leftClass = true : this._rightClass = true;
  }
  cleanAfterAnimation(): void {
    this._leftClass = this._rightClass = this._nextClass = this._prevClass = false;
  }
}

@Directive({
  selector: 'carousel-caption',
  host: {
    '[class.carousel-caption]': 'carouselCaptionClass'
  }
})
export class CarouselCaption {
  private carouselCaptionClass: boolean = true;
}

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
    '(mouseenter)': 'toggleAutomaticSliding()',
    '(mouseleave)': 'toggleAutomaticSliding()'
  },
  events: ['indexchange', 'slidestart', 'slideend']
})
@View({
  templateUrl: './carousel/carousel.html',
  directives: [NgFor, NgIf]
})
export class Carousel {
  
  pause: string = "hover";
  
  private indexchange: EventEmitter = new EventEmitter();
  private slidestart: EventEmitter = new EventEmitter();
  private slideend: EventEmitter = new EventEmitter();
  
  private _el: ElementRef;
  private _activeIndex: number = -1;
  private _interval: number = 5000;
  private _isChangingSlide: boolean = false;
  private _isToRight: boolean = true;
  private _noTransition: boolean = false;
  private _query: QueryList<CarouselSlide>;
  private _slides: Array<CarouselSlide> = [];
  private _timerId: number = null;
  private _transitionEnd: string = getTransitionEnd();
  private  _wrap: boolean = true;

  constructor(@Query(CarouselSlide) query: QueryList<CarouselSlide>, el: ElementRef) {
    this._el = el;
    this._startCycling();
    query.onChange(() => {
      this._registerSlides(query);
    });
  }
  
  private _registerSlides(query: QueryList<CarouselSlide>): void {
    var activeSlide = this._slides[this._activeIndex];
    this._slides = [];
    var activationDone = false;
    for (var i = 0; i < query.length; i++) {
      var slide = query._results[i];
      slide.deactivate();
      slide.cleanAfterAnimation();
      if (slide === activeSlide || (typeof activeSlide === "undefined" && this._activeIndex == this._slides.length)) {
        slide.activate();
        if (this._activeIndex !== this._slides.length) {
          if (typeof this._activeIndex != "string") {
            this.indexchange.next(this._slides.length);
          }
          this._activeIndex = this._slides.length;
        }
        activationDone = true;
      }
      this._slides.push(slide);
    }
    if (!activationDone) {
      this._slides[0].activate();
      this._activeIndex = 0;
      this.indexchange.next(this._activeIndex);
    }
    this._isChangingSlide = false;
    this._isToRight = null;
  }
  
  set wrap (newValue: boolean | string) {
    this._wrap = typeof newValue === "string" ? newValue != "false" : newValue;
  }
  set noTransition (newValue: boolean | string) {
    this._noTransition = typeof newValue === "string" ? newValue != "false" : newValue;
  }
  set interval(newValue: number | string) {
    this._interval = typeof newValue === "string" ? parseInt(newValue) : newValue;
    this._stopCycling();
    this._startCycling();
  }
  set index(newValue: number) {
    //Navigation a new index
    if (!this._isChangingSlide && newValue != this._activeIndex && newValue >= 0 && newValue <= this._slides.length - 1) {
      this._isChangingSlide = true;
      if (this._isToRight == null) {
        this._isToRight = newValue > this._activeIndex;
      }
      this.slidestart.next(null);
      var currentSlide = this._slides[this._activeIndex];
      var nextSlide = this._slides[newValue];
      if (!this._noTransition && this._transitionEnd && currentSlide) {
        nextSlide.prepareAnimation(this._isToRight);
        setTimeout(() => {
          currentSlide.animate(this._isToRight);
          nextSlide.animate(this._isToRight);
          var endAnimationCallback = (event) => {
            currentSlide.getElement().removeEventListener(this._transitionEnd, endAnimationCallback, false);
            this._finalizeTransition(currentSlide, nextSlide, newValue);
          };
          currentSlide.getElement().addEventListener(this._transitionEnd, endAnimationCallback, false);
        }, 30);
      } else {
        this._finalizeTransition(currentSlide, nextSlide, newValue);
      }
    }
    //Initial value
    else if (this._activeIndex == -1) {
      this._finalizeTransition(null, null, newValue);
      //Force change detection
      this._el.parentView._view.changeDetector.detectChanges()
    }
  }
  private _finalizeTransition(currentSlide: CarouselSlide, nextSlide: CarouselSlide, newValue: number): void {
    if (currentSlide) {
      currentSlide.deactivate();
      currentSlide.cleanAfterAnimation();
    }
    if (nextSlide) {
      nextSlide.activate();
      nextSlide.cleanAfterAnimation();
    }
    this._activeIndex = newValue;
    this._isChangingSlide = false;
    this._isToRight = null;
    if (currentSlide || nextSlide) {
      this.slideend.next(null);
      this.indexchange.next(this._activeIndex);
    }
    
  }
  
  navigateTo(newIndex: number): void {
    this.index = newIndex;
  }
  prev(): void {
    if (this.hasPrev()) {
      var prevIndex = this._activeIndex - 1 < 0 ? this._slides.length - 1 : this._activeIndex - 1;
      this._isToRight = false;
      this.index = prevIndex;
    }
  }
  next(): void {
    if (this.hasNext()) {
      var nextIndex = (this._activeIndex + 1) % this._slides.length;
      this._isToRight = true;
      this.index = nextIndex;
    }
  }
  hasPrev(): boolean {
    return this._slides.length > 1 &&  !(!this._wrap && this._activeIndex === 0);
  }
  hasNext(): boolean {
    return this._slides.length > 1 && !(!this._wrap && this._activeIndex === (this._slides.length - 1));
  }
  toggleAutomaticSliding(): void {
    if (this.pause === "hover") {
      if (this._timerId) {
        this._stopCycling();
      } else {
        this._startCycling();
      }
    }
  }
  
  private _startCycling(): void {
    if (this._interval >= 0) {
      this._timerId = setInterval(() => {
        this.next();
      }, this._interval > 600 ? this._interval: 600); //600ms is the transition duration defined in BS css
    }
  }
  private _stopCycling(): void {
    if (this._timerId) {
      clearInterval(this._timerId);
    }
    this._timerId = null;
  }
}

// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
// ============================================================
function getTransitionEnd(): string {
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
    return null;
}
