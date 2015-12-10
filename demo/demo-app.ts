/// <reference path="../typings/_custom.d.ts" />
import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {ROUTER_PROVIDERS, RouteConfig, RouterOutlet, RouterLink, LocationStrategy, HashLocationStrategy} from 'angular2/router';
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

bootstrap(DemoApp, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
