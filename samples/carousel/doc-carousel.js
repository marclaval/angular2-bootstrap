System.register("samples/carousel/doc-carousel", ["angular2/angular2"], function($__export) {
  "use strict";
  var __moduleName = "samples/carousel/doc-carousel";
  var Component,
      View,
      DocCarousel;
  return {
    setters: [function($__m) {
      Component = $__m.ComponentAnnotation;
      View = $__m.ViewAnnotation;
    }],
    execute: function() {
      DocCarousel = (function() {
        function DocCarousel() {}
        return ($traceurRuntime.createClass)(DocCarousel, {}, {});
      }());
      $__export("DocCarousel", DocCarousel);
      Object.defineProperty(DocCarousel, "annotations", {get: function() {
          return [new Component({selector: 'doc-carousel'}), new View({templateUrl: './samples/carousel/README.html'})];
        }});
    }
  };
});
