System.register("demo-app", ["angular2/angular2", "./samples/carousel/demo-carousel", "./samples/carousel/doc-carousel"], function($__export) {
  "use strict";
  var __moduleName = "demo-app";
  var Component,
      Template,
      DemoCarousel,
      DocCarousel,
      DemoApp;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
    }, function($__m) {
      DemoCarousel = $__m.DemoCarousel;
    }, function($__m) {
      DocCarousel = $__m.DocCarousel;
    }],
    execute: function() {
      DemoApp = $__export("DemoApp", (function() {
        var DemoApp = function DemoApp() {};
        return ($traceurRuntime.createClass)(DemoApp, {}, {});
      }()));
      Object.defineProperty(DemoApp, "annotations", {get: function() {
          return [new Component({selector: 'demo-app'}), new Template({
            url: 'demo-app.html',
            directives: [DemoCarousel, DocCarousel]
          })];
        }});
    }
  };
});
