/// <reference path="../typings/tsd.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {DemoCarousel} from './samples/carousel/demo-carousel';
import {DocCarousel} from './samples/carousel/doc-carousel';
import {DemoAlert} from './samples/alert/demo-alert';
import {DocAlert} from './samples/alert/doc-alert';

@Component({
  selector: 'demo-app'
})
@View({
  templateUrl: 'demo-app.html',
  directives: [DemoCarousel, DocCarousel, DemoAlert, DocAlert]
})
export class DemoApp {
}

bootstrap(DemoApp);
