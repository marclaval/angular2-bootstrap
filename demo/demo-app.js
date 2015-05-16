import {ComponentAnnotation as Component, ViewAnnotation as View, bootstrap} from 'angular2/angular2';
import {DemoCarousel} from './samples/carousel/demo-carousel'
import {DocCarousel} from './samples/carousel/doc-carousel'

@Component({
  selector: 'demo-app'
})
@View({
  templateUrl: 'demo-app.html',
  directives: [DemoCarousel, DocCarousel]
})
export class DemoApp {
}

bootstrap(DemoApp);
