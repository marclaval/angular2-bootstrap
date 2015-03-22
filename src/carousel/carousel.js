import {Component, Template, Decorator, NgElement, Ancestor, Foreach} from 'angular2/angular2';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {EventEmitter} from 'angular2/src/core/annotations/di';

@Component({
  selector: 'carousel',
  bind : {
    'index': 'index'
  }
})
@Template({
  url: './carousel/carousel.html',
  directives: [Foreach]
})
export class Carousel {
  constructor(@EventEmitter('indexchange') emitter:Function) {
    this.emitter = emitter;
    this.activeIndex = 0;
    this.slides = [];
  }
  set index(newValue) {
    this.activeIndex = newValue;
    this.slides.forEach((slide) => {
      slide.refresh(this);
    });
    this.emitter(newValue);
  }
  registerSlide(slide: Slide) {
    this.slides.push(slide);
  }
  navigateTo(newIndex) {
    this.index = newIndex;
  }
  next() {
    var nextIndex = (this.activeIndex + 1) % this.slides.length;
    this.index = nextIndex;
  }
  prev() {
    var prevIndex = this.activeIndex - 1 < 0 ? this.slides.length - 1 : this.activeIndex - 1;
    this.index = prevIndex;
  }
}

@Decorator({
  selector: '[slide]'
})
export class Slide {
  constructor(el: NgElement, @Ancestor() carousel: Carousel) {
    this.el = el;
    DOM.addClass(el.domElement, "item");
    this.index = carousel.slides.length;
    carousel.registerSlide(this);
    this.refresh(carousel);
  }
  refresh(carousel) {
    if (this.index == carousel.activeIndex) {
      DOM.addClass(this.el.domElement, "active");
    } else {
      DOM.removeClass(this.el.domElement, "active");
    }
  }
}

@Decorator({
  selector: '[caption]'
})
export class Caption {
  constructor(el: NgElement) {
    DOM.addClass(el.domElement, "carousel-caption");
  }
}
