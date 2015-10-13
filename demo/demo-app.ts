/// <reference path="../typings/_custom.d.ts" />
import {Component, View, bootstrap, bind} from 'angular2/angular2';
import {ROUTER_BINDINGS, ROUTER_PRIMARY_COMPONENT, RouteConfig, RouterOutlet, RouterLink, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {Sample} from './samples/sample';
import {Samples} from "./samples/samples";
import {NotFound} from "./content/not-found";

@Component({
  selector: 'demo-app',
  templateUrl: 'demo-app.html',
  directives: [RouterOutlet, RouterLink]
})
@RouteConfig([
  { path: '/', component: Samples, as: 'Samples' },
  { path: '/sample/:name', component: Sample, as: 'Sample'},
  { path: '/:whatever', component: NotFound, as: 'NotFound' }
])
export class DemoApp {
}

bootstrap(DemoApp, [ROUTER_BINDINGS, bind(ROUTER_PRIMARY_COMPONENT).toValue(DemoApp), bind(LocationStrategy).toClass(HashLocationStrategy)]);
