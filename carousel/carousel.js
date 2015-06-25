System.register("carousel/carousel", ["angular2/angular2", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "carousel/carousel";
  var Component,
      View,
      Directive,
      ElementRef,
      Ancestor,
      NgFor,
      onDestroy,
      EventEmitter,
      ObservableWrapper,
      Carousel,
      CarouselSlide,
      CarouselCaption;
  function getTransitionEnd() {
    var el = document.createElement('angular2-bootstrap');
    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };
    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }
    return false;
  }
  return {
    setters: [function($__m) {
      Component = $__m.ComponentAnnotation;
      View = $__m.ViewAnnotation;
      Directive = $__m.DirectiveAnnotation;
      ElementRef = $__m.ElementRef;
      Ancestor = $__m.AncestorAnnotation;
      NgFor = $__m.NgFor;
      onDestroy = $__m.onDestroy;
    }, function($__m) {
      EventEmitter = $__m.EventEmitter;
      ObservableWrapper = $__m.ObservableWrapper;
    }],
    execute: function() {
      Carousel = function() {
        function Carousel() {
          this.indexchange = new EventEmitter();
          this.slidestart = new EventEmitter();
          this.slideend = new EventEmitter();
          this.activeIndex = -1;
          this.slides = [];
          this.wrap = true;
          this._interval = 5000;
          this.pause = "hover", this.timerId = null;
          this.noTransition = false;
          this.transitionEnd = getTransitionEnd();
          this._isToRight = true;
          this._isChangingSlide = false;
          this._startCycling();
        }
        return ($traceurRuntime.createClass)(Carousel, {
          set index(newValue) {
            var $__0 = this;
            if (!this._isChangingSlide && newValue != this.activeIndex && newValue >= 0 && newValue <= this.slides.length - 1) {
              this._isChangingSlide = true;
              if (this._isToRight == null) {
                this._isToRight = newValue > this.activeIndex;
              }
              this.slidestart.next();
              var currentSlide = this.slides[this.activeIndex];
              var nextSlide = this.slides[newValue];
              if (this.activeIndex == -1) {
                this._finalizeTransition(null, nextSlide, newValue);
              } else if (!this.noTransition && this.transitionEnd && currentSlide) {
                nextSlide.prepareAnimation(this._isToRight);
                setTimeout(function() {
                  currentSlide.animate($__0._isToRight);
                  nextSlide.animate($__0._isToRight);
                  var endAnimationCallback = function(event) {
                    currentSlide.getElement().removeEventListener($__0.transitionEnd, endAnimationCallback, false);
                    $__0._finalizeTransition(currentSlide, nextSlide, newValue);
                  };
                  currentSlide.getElement().addEventListener($__0.transitionEnd, endAnimationCallback, false);
                }, 30);
              } else {
                this._finalizeTransition(currentSlide, nextSlide, newValue);
              }
            }
          },
          _finalizeTransition: function(currentSlide, nextSlide, newValue) {
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
          },
          set interval(newValue) {
            this._interval = newValue;
            this._stopCycling();
            this._startCycling();
          },
          registerSlide: function(slide, slideIndex) {
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
          },
          unregisterSlide: function(slide) {
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
          },
          _resetAfterSlidesChange: function() {
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
          },
          navigateTo: function(newIndex) {
            this.index = newIndex;
          },
          prev: function() {
            if (this.hasPrev()) {
              var prevIndex = this.activeIndex - 1 < 0 ? this.slides.length - 1 : this.activeIndex - 1;
              this._isToRight = false;
              this.index = prevIndex;
            }
          },
          next: function() {
            if (this.hasNext()) {
              var nextIndex = (this.activeIndex + 1) % this.slides.length;
              this._isToRight = true;
              this.index = nextIndex;
            }
          },
          hasPrev: function() {
            return this.slides.length > 1 && !(!this.wrap && this.activeIndex === 0);
          },
          hasNext: function() {
            return this.slides.length > 1 && !(!this.wrap && this.activeIndex === (this.slides.length - 1));
          },
          _startCycling: function() {
            var $__0 = this;
            if (this._interval >= 0) {
              this.timerId = setInterval(function() {
                $__0.next();
              }, this._interval > 600 ? this._interval : 600);
            }
          },
          _stopCycling: function() {
            if (this.timerId) {
              clearInterval(this.timerId);
            }
            this.timerId = null;
          },
          toggleOnHover: function() {
            if (this.pause === "hover") {
              if (this.timerId) {
                this._stopCycling();
              } else {
                this._startCycling();
              }
            }
          },
          _fireEvent: function(msg, value) {
            ObservableWrapper.callNext(this.eventEmitter, msg, value);
          }
        }, {});
      }();
      $__export("Carousel", Carousel);
      Object.defineProperty(Carousel, "annotations", {get: function() {
          return [new Component({
            selector: 'carousel',
            properties: ['index', 'wrap', 'interval', 'pause', 'noTransition: no-transition'],
            host: {
              '(mouseenter)': 'toggleOnHover()',
              '(mouseleave)': 'toggleOnHover()'
            },
            events: ['indexchange', 'slidestart', 'slideend']
          }), new View({
            templateUrl: './carousel/carousel.html',
            directives: [NgFor]
          })];
        }});
      Object.defineProperty(Carousel.prototype.registerSlide, "parameters", {get: function() {
          return [[Slide], []];
        }});
      Object.defineProperty(Carousel.prototype.unregisterSlide, "parameters", {get: function() {
          return [[Slide]];
        }});
      Object.defineProperty(Carousel.prototype._fireEvent, "parameters", {get: function() {
          return [[$traceurRuntime.type.string], [$traceurRuntime.type.any]];
        }});
      CarouselSlide = function() {
        function CarouselSlide(el, carousel) {
          var $__0 = this;
          this.carousel = carousel;
          this.el = el.nativeElement;
          this.activate = function() {
            $__0.activeClass = true;
          };
          this.deactivate = function() {
            $__0.activeClass = false;
          };
          this.prepareAnimation = function(isToRight) {
            isToRight ? $__0.nextClass = true : $__0.prevClass = true;
          };
          this.animate = function(isToRight) {
            isToRight ? $__0.leftClass = true : $__0.rightClass = true;
          };
          this.cleanAfterAnimation = function() {
            $__0.leftClass = false;
            $__0.rightClass = false;
            $__0.nextClass = false;
            $__0.prevClass = false;
          };
          var slideIndex = this.carousel.slides.length;
          carousel.registerSlide(this, slideIndex);
          this.itemClass = true;
        }
        return ($traceurRuntime.createClass)(CarouselSlide, {
          getElement: function() {
            return this.el;
          },
          onDestroy: function() {
            this.carousel.unregisterSlide(this);
          }
        }, {});
      }();
      $__export("CarouselSlide", CarouselSlide);
      Object.defineProperty(CarouselSlide, "annotations", {get: function() {
          return [new Directive({
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
          })];
        }});
      Object.defineProperty(CarouselSlide, "parameters", {get: function() {
          return [[ElementRef], [Carousel, new Ancestor()]];
        }});
      CarouselCaption = function() {
        function CarouselCaption() {
          this.carouselCaptionClass = true;
        }
        return ($traceurRuntime.createClass)(CarouselCaption, {}, {});
      }();
      $__export("CarouselCaption", CarouselCaption);
      Object.defineProperty(CarouselCaption, "annotations", {get: function() {
          return [new Directive({
            selector: 'carousel-caption',
            host: {'[class.carousel-caption]': 'carouselCaptionClass'}
          })];
        }});
    }
  };
});
