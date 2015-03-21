import {Component, Template} from 'angular2/angular2';
import {Carousel} from 'carousel/carousel';

@Component({
  selector: 'demo-carousel'
})
@Template({
  url: './samples/carousel/demo-carousel.html',
  directives: [Carousel]
})
export class DemoCarousel {
}
