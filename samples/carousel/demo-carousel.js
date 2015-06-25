System.register("samples/carousel/demo-carousel", ["angular2/angular2", "carousel/carousel"], function($__export) {
  "use strict";
  var __moduleName = "samples/carousel/demo-carousel";
  var Component,
      View,
      NgIf,
      Carousel,
      CarouselSlide,
      CarouselCaption,
      DemoCarousel;
  return {
    setters: [function($__m) {
      Component = $__m.ComponentAnnotation;
      View = $__m.ViewAnnotation;
      NgIf = $__m.NgIf;
    }, function($__m) {
      Carousel = $__m.Carousel;
      CarouselSlide = $__m.CarouselSlide;
      CarouselCaption = $__m.CarouselCaption;
    }],
    execute: function() {
      DemoCarousel = function() {
        function DemoCarousel() {
          this.slideIndex = 1;
          this.slideWrap = true;
          this.slideInterval = 5000;
          this.slidePause = "hover";
          this.slideNoTransition = false;
          this.extraSlides = false;
        }
        return ($traceurRuntime.createClass)(DemoCarousel, {
          onIndexFieldChange: function(event) {
            this.slideIndex = event.target.value;
          },
          onIndexChange: function(newValue) {
            this.slideIndex = newValue;
          },
          onIntervalFieldChange: function(event) {
            this.slideInterval = event.target.value;
          },
          onWrapCheckboxChange: function(event) {
            this.slideWrap = event.target.checked;
          },
          onPauseCheckboxChange: function(event) {
            this.slidePause = event.target.checked ? "hover" : "";
          },
          onAnimationCheckboxChange: function(event) {
            this.slideNoTransition = !event.target.checked;
          },
          onExtraCheckboxChange: function(event) {
            this.extraSlides = event.target.checked;
          },
          onSlideStart: function() {},
          onSlideEnd: function() {}
        }, {});
      }();
      $__export("DemoCarousel", DemoCarousel);
      Object.defineProperty(DemoCarousel, "annotations", {get: function() {
          return [new Component({selector: 'demo-carousel'}), new View({
            templateUrl: './samples/carousel/demo-carousel.html',
            directives: [NgIf, Carousel, CarouselSlide, CarouselCaption]
          })];
        }});
    }
  };
});
