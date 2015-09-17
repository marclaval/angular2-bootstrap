/// <reference path="../../typings/tsd.d.ts" />
import {Component, View, DynamicComponentLoader, ElementRef} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {DemoCarousel} from './carousel/demo-carousel';
import {DocCarousel, SourceHtmlCarousel, SourceTsCarousel} from './carousel/doc-carousel';
import {DemoAlert} from './alert/demo-alert';
import {DocAlert, SourceHtmlAlert, SourceTsAlert} from './alert/doc-alert';
import {Capitalize} from '../content/capitalize';

@Component({
  selector: 'sample'
})
@View({
  templateUrl: './samples/sample.html',
  pipes: [Capitalize]
})
export class Sample {
  private _name: string;
  private _isHTMLActive: boolean = true;
  private _displayHTML: string = "block";
  private _displayTS: string = "none";
  
  constructor(params: RouteParams, elementRef: ElementRef, loader: DynamicComponentLoader) {
    this._name = params.get('name');
    var {demo, doc, html, ts} = this._getSample(this._name);
    loader.loadIntoLocation(demo, elementRef, 'demo');
    loader.loadIntoLocation(doc, elementRef, 'doc');
    loader.loadIntoLocation(html, elementRef, 'html');
    loader.loadIntoLocation(ts, elementRef, 'ts');
  }
  
  toggle(evt) {
    evt.preventDefault();
    this._isHTMLActive = !this._isHTMLActive;
    this._displayHTML = this._isHTMLActive ? "block" : "none";
    this._displayTS = !this._isHTMLActive ? "block" : "none";
  }
  
  _getSample(name: string): {demo: any, doc: any, html: any, ts: any} {
    if (name == 'carousel') {
      return {demo: DemoCarousel, doc: DocCarousel, html: SourceHtmlCarousel, ts: SourceTsCarousel};
    } else {
      return {demo: DemoAlert, doc: DocAlert, html: SourceHtmlAlert, ts: SourceTsAlert};
    }
  }
}