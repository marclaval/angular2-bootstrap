System.register("demo-app", ["angular2/angular2", "./samples/carousel/demo-carousel", "./samples/carousel/doc-carousel"], function($__export) {
  "use strict";
  var __moduleName = "demo-app";
  var Component,
      View,
      bootstrap,
      DemoCarousel,
      DocCarousel,
      DemoApp;
  return {
    setters: [function($__m) {
      Component = $__m.ComponentAnnotation;
      View = $__m.ViewAnnotation;
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      DemoCarousel = $__m.DemoCarousel;
    }, function($__m) {
      DocCarousel = $__m.DocCarousel;
    }],
    execute: function() {
      DemoApp = (function() {
        function DemoApp() {}
        return ($traceurRuntime.createClass)(DemoApp, {}, {});
      }());
      $__export("DemoApp", DemoApp);
      Object.defineProperty(DemoApp, "annotations", {get: function() {
          return [new Component({selector: 'demo-app'}), new View({
            templateUrl: 'demo-app.html',
            directives: [DemoCarousel, DocCarousel]
          })];
        }});
      bootstrap(DemoApp);
    }
  };
});
