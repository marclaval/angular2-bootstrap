import {Component, Template} from 'angular2/angular2';
import {Carousel, CarouselSlide, CarouselCaption} from 'carousel/carousel';

@Component({
  selector: 'demo-carousel'
})
@Template({
  url: './samples/carousel/demo-carousel.html',
  directives: [Carousel, CarouselSlide, CarouselCaption]
})
export class DemoCarousel {
  constructor() {
    this.slideIndex = 1;
    this.slideWrap = true;
    this.slideInterval = 5000;
    this.slidePause = "hover";
  }
  onIndexFieldChange(event) {
    this.slideIndex = event.target.value;
  }
  onIndexChange(newValue) {
    this.slideIndex = newValue;
  }
  onIntervalFieldChange(event) {
    this.slideInterval = event.target.value;
  }
  onWrapCheckboxChange(event) {
    this.slideWrap = event.target.checked;
  }
  onPauseCheckboxChange(event) {
    this.slidePause = event.target.checked ? "hover": "";
  }
}
