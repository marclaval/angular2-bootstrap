import {Component, Template} from 'angular2/angular2';
import {DemoCarousel} from './samples/carousel/demo-carousel'
import {DocCarousel} from './samples/carousel/doc-carousel'

@Component({
  selector: 'demo-app'
})
@Template({
  url: 'demo-app.html',
  directives: [DemoCarousel, DocCarousel]
})
export class DemoApp {
}
