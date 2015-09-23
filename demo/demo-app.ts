/// <reference path="../typings/_custom.d.ts" />
import {Component, View, bootstrap, bind} from 'angular2/angular2';
import {ROUTER_BINDINGS, RouteConfig, RouterOutlet, RouterLink, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {Sample} from './samples/sample';
import {Samples} from "./samples/samples";
import {NotFound} from "./content/not-found";

@Component({
  selector: 'demo-app'
})
@RouteConfig([
  { path: '/', component: Samples, as: 'samples' },
  { path: '/sample/:name', component: Sample, as: 'sample'},
  { path: '/:whatever', component: NotFound, as: 'notfound' }
])
@View({
  templateUrl: 'demo-app.html',
  directives: [RouterOutlet, RouterLink]
})
export class DemoApp {
}

bootstrap(DemoApp, [ROUTER_BINDINGS, bind(LocationStrategy).toClass(HashLocationStrategy)]);
