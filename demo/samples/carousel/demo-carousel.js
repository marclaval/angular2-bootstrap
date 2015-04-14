import {Component, View, If} from 'angular2/angular2';
import {Carousel, CarouselSlide, CarouselCaption} from 'carousel/carousel';

@Component({
  selector: 'demo-carousel'
})
@View({
  templateUrl: './samples/carousel/demo-carousel.html',
  directives: [If, Carousel, CarouselSlide, CarouselCaption]
})
export class DemoCarousel {
  constructor() {
    this.slideIndex = 1;
    this.slideWrap = true;
    this.slideInterval = 5000;
    this.slidePause = "hover";
    this.slideNoTransition = false;
    this.extraSlides = false;
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
  onAnimationCheckboxChange(event) {
    this.slideNoTransition = !event.target.checked;
  }
  onExtraCheckboxChange(event) {
    this.extraSlides = event.target.checked;
  }
  onSlideStart() {
    //console.log("Start sliding");
  }
  onSlideEnd() {
    //console.log("End sliding");
  }
}
