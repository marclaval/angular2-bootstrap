/// <reference path="../../../typings/tsd.d.ts" />
import {Component, View, NgNonBindable} from 'angular2/angular2';

@Component({
  selector: 'doc-carousel'
})
@View({
  templateUrl: './samples/carousel/README.html'
})
export class DocCarousel {
}

@Component({
  selector: 'source-html-carousel'
})
@View({
  templateUrl: './samples/carousel/demo-carousel.html.source.html',
  directives: [NgNonBindable]
})
export class SourceHtmlCarousel {
}

@Component({
  selector: 'source-ts-carousel'
})
@View({
  templateUrl: './samples/carousel/demo-carousel.ts.source.html',
  directives: [NgNonBindable]
})
export class SourceTsCarousel {
}