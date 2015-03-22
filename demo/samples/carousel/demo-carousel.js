import {Component, Template} from 'angular2/angular2';
import {Carousel, Slide, Caption} from 'carousel/carousel';

@Component({
  selector: 'demo-carousel'
})
@Template({
  url: './samples/carousel/demo-carousel.html',
  directives: [Carousel, Slide, Caption]
})
export class DemoCarousel {
  constructor() {
    this.slideIndex = 1;
  }
  onIndexFieldChange(event) {
    this.slideIndex = event.target.value;
  }
  onIndexChange(newValue) {
    this.slideIndex = newValue;
  }
}
