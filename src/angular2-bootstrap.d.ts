import { ElementRef, QueryList } from 'angular2/angular2';

declare module angular2Bootstrap {
  class Alert {
    static alertTypes: string[];
    private _el;
    private _transitionEnd;
    private _dismissible;
    private _fade;
    private _in;
    private _type;
    private _opened;
    private closestart;
    private closeend;
    constructor(el: ElementRef);
    dismissible: string | boolean;
    fade: string | boolean;
    type: string;
    opened: string | boolean;
    close(): void;
    _finalizeTransition(): void;
  }
  
  class CarouselSlide {
    private _el;
    private _itemClass;
    private _activeClass;
    private _leftClass;
    private _rightClass;
    private _prevClass;
    private _nextClass;
    constructor(el: ElementRef);
    getElement(): HTMLElement;
    activate(): void;
    deactivate(): void;
    prepareAnimation(isToRight: boolean): void;
    animate(isToRight: boolean): void;
    cleanAfterAnimation(): void;
  }
  
  class CarouselCaption {
    private carouselCaptionClass;
  }
  
  class Carousel {
    pause: string;
    private indexchange;
    private slidestart;
    private slideend;
    private _el;
    private _activeIndex;
    private _interval;
    private _isChangingSlide;
    private _isToRight;
    private _noTransition;
    private _query;
    private _slides;
    private _timerId;
    private _transitionEnd;
    private _wrap;
    constructor(query: QueryList<CarouselSlide>, el: ElementRef);
    private _registerSlides(query);
    wrap: boolean | string;
    noTransition: boolean | string;
    interval: number | string;
    index: number;
    private _finalizeTransition(currentSlide, nextSlide, newValue);
    navigateTo(newIndex: number): void;
    prev(): void;
    next(): void;
    hasPrev(): boolean;
    hasNext(): boolean;
    toggleAutomaticSliding(): void;
    private _startCycling();
    private _stopCycling();
  }
}

declare module "angular2-bootstrap" {
  export = angular2Bootstrap;
}