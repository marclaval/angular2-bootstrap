System.register("samples/carousel/doc-carousel", ["angular2/angular2"], function($__export) {
  "use strict";
  var __moduleName = "samples/carousel/doc-carousel";
  var Component,
      Template,
      DocCarousel;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
    }],
    execute: function() {
      DocCarousel = $__export("DocCarousel", (function() {
        var DocCarousel = function DocCarousel() {
          ;
        };
        return ($traceurRuntime.createClass)(DocCarousel, {}, {});
      }()));
      Object.defineProperty(DocCarousel, "annotations", {get: function() {
          return [new Component({selector: 'doc-carousel'}), new Template({url: './samples/carousel/README.html'})];
        }});
    }
  };
});
