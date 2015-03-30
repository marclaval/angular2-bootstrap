System.register("carousel/carousel", ["angular2/angular2", "angular2/src/core/annotations/di"], function($__export) {
  "use strict";
  var __moduleName = "carousel/carousel";
  var Component,
      Template,
      Decorator,
      NgElement,
      Ancestor,
      For,
      onDestroy,
      EventEmitter,
      PropertySetter,
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
      Component = $__m.Component;
      Template = $__m.Template;
      Decorator = $__m.Decorator;
      NgElement = $__m.NgElement;
      Ancestor = $__m.Ancestor;
      For = $__m.For;
      onDestroy = $__m.onDestroy;
    }, function($__m) {
      EventEmitter = $__m.EventEmitter;
      PropertySetter = $__m.PropertySetter;
    }],
    execute: function() {
      Carousel = $__export("Carousel", (function() {
        var Carousel = function Carousel(indexChangeEmitter, slidestartEmitter, slideendEmitter) {
          this.indexChangeEmitter = indexChangeEmitter;
          this.slidestartEmitter = slidestartEmitter;
          this.slideendEmitter = slideendEmitter;
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
        };
        return ($traceurRuntime.createClass)(Carousel, {
          set index(newValue) {
            var $__0 = this;
            if (!this._isChangingSlide && newValue != this.activeIndex && newValue >= 0 && newValue <= this.slides.length - 1) {
              this._isChangingSlide = true;
              if (this._isToRight == null) {
                this._isToRight = newValue > this.activeIndex;
              }
              this.slidestartEmitter();
              var currentSlide = this.slides[this.activeIndex];
              var nextSlide = this.slides[newValue];
              if (this.activeIndex == -1) {
                this._finalizeTransition(null, nextSlide, newValue);
              } else if (!this.noTransition && this.transitionEnd && currentSlide) {
                nextSlide.prepareAnimation(this._isToRight);
                setTimeout((function() {
                  currentSlide.animate($__0._isToRight);
                  nextSlide.animate($__0._isToRight);
                  var endAnimationCallback = (function(event) {
                    currentSlide.getElement().removeEventListener($__0.transitionEnd, endAnimationCallback, false);
                    $__0._finalizeTransition(currentSlide, nextSlide, newValue);
                  });
                  currentSlide.getElement().addEventListener($__0.transitionEnd, endAnimationCallback, false);
                }), 30);
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
            this.slideendEmitter();
            this.indexChangeEmitter(this.activeIndex);
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
                this.indexChangeEmitter(this.activeIndex);
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
              this.timerId = setInterval((function() {
                $__0.next();
              }), this._interval > 600 ? this._interval : 600);
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
          }
        }, {});
      }()));
      Object.defineProperty(Carousel, "annotations", {get: function() {
          return [new Component({
            selector: 'carousel',
            bind: {
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
          }), new Template({
            url: './carousel/carousel.html',
            directives: [For]
          })];
        }});
      Object.defineProperty(Carousel, "parameters", {get: function() {
          return [[Function, new EventEmitter('indexchange')], [Function, new EventEmitter('slidestart')], [Function, new EventEmitter('slideend')]];
        }});
      Object.defineProperty(Carousel.prototype.registerSlide, "parameters", {get: function() {
          return [[Slide], []];
        }});
      Object.defineProperty(Carousel.prototype.unregisterSlide, "parameters", {get: function() {
          return [[Slide]];
        }});
      CarouselSlide = $__export("CarouselSlide", (function() {
        var CarouselSlide = function CarouselSlide(el, carousel, activeSetter, itemSetter, leftSetter, rightSetter, prevSetter, nextSetter, roleSetter) {
          this.carousel = carousel;
          this.el = el.domElement;
          this.activate = (function() {
            activeSetter(true);
          });
          this.deactivate = (function() {
            activeSetter(false);
          });
          this.prepareAnimation = (function(isToRight) {
            isToRight ? nextSetter(true) : prevSetter(true);
          });
          this.animate = (function(isToRight) {
            isToRight ? leftSetter(true) : rightSetter(true);
          });
          this.cleanAfterAnimation = (function() {
            leftSetter(false);
            rightSetter(false);
            nextSetter(false);
            prevSetter(false);
          });
          var slideIndex = [].indexOf.call(this.el.parentNode.querySelectorAll('carousel-slide'), this.el);
          carousel.registerSlide(this, slideIndex);
          itemSetter(true);
          roleSetter("listbox");
        };
        return ($traceurRuntime.createClass)(CarouselSlide, {
          getElement: function() {
            return this.el;
          },
          onDestroy: function() {
            this.carousel.unregisterSlide(this);
          }
        }, {});
      }()));
      Object.defineProperty(CarouselSlide, "annotations", {get: function() {
          return [new Decorator({
            selector: 'carousel-slide',
            lifecycle: [onDestroy]
          })];
        }});
      Object.defineProperty(CarouselSlide, "parameters", {get: function() {
          return [[NgElement], [Carousel, new Ancestor()], [Function, new PropertySetter('class.active')], [Function, new PropertySetter('class.item')], [Function, new PropertySetter('class.left')], [Function, new PropertySetter('class.right')], [Function, new PropertySetter('class.prev')], [Function, new PropertySetter('class.next')], [Function, new PropertySetter('attr.role')]];
        }});
      CarouselCaption = $__export("CarouselCaption", (function() {
        var CarouselCaption = function CarouselCaption(captionSetter) {
          captionSetter(true);
        };
        return ($traceurRuntime.createClass)(CarouselCaption, {}, {});
      }()));
      Object.defineProperty(CarouselCaption, "annotations", {get: function() {
          return [new Decorator({selector: 'carousel-caption'})];
        }});
      Object.defineProperty(CarouselCaption, "parameters", {get: function() {
          return [[Function, new PropertySetter('class.carousel-caption')]];
        }});
    }
  };
});
