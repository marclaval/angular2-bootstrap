/// <reference path="../../typings/tsd.d.ts" />
import {Component, View} from 'angular2/angular2';
import {DemoCarousel} from './carousel/demo-carousel';
import {DocCarousel} from './carousel/doc-carousel';
import {DemoAlert} from './alert/demo-alert';
import {DocAlert} from './alert/doc-alert';

@Component({
  selector: 'samples'
})
@View({
  templateUrl: './samples/samples.html',
  directives: [DemoCarousel, DocCarousel, DemoAlert, DocAlert]
})
export class Samples {
}