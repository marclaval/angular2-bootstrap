/// <reference path="../../typings/tsd.d.ts" />
import {
  AsyncTestCompleter,
  TestComponentBuilder,
  By,
  beforeEach,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  it,
  xit,
} from 'angular2/test';
import {Component, View} from 'angular2/angular2';
import {Carousel, CarouselSlide, CarouselCaption} from 'src/carousel/carousel';

export function main() {
  describe('Carousel', () => {
    var cpt : Carousel = null;
    var el : HTMLElement = null;

    function runTest({nbOfSlides = 3, index = 0, interval = 1000, noTransition = true, pause = "hover", wrap = true}, tcb, async, cb) {
      var html = `<carousel index="${index}" interval="${noTransition}" no-transition="${noTransition}" pause="${pause}" wrap="${wrap}">`;
      for (var i = 0; i < nbOfSlides; i++) {
        html += `<carousel-slide><div>${i+1}</div></carousel-slide>`;
      }
      html += '</carousel>';
      tcb.overrideTemplate(TestComponent, html)
        .createAsync(TestComponent)
        .then((rootTC) => {
          rootTC._componentParentView.changeDetector.detectChanges();
          rootTC._componentParentView.changeDetector.detectChanges();
          cpt = rootTC.componentViewChildren[0].componentInstance;
          el = rootTC.componentViewChildren[0].nativeElement;       
          cb(rootTC, () => rootTC._componentParentView.changeDetector.detectChanges());
          async.done();
        });
    }

    function testSlideActive(index) {
      var activeSlides = [];
      var slides =  el.querySelectorAll('carousel-slide');
      expect(index).toBeLessThan(slides.length);
      for (var i = 0; i < slides.length; i++) {
        if ((<HTMLElement>slides[i]).className.indexOf("active") > -1) {
            activeSlides.push(i);
        }            
      }
      expect(activeSlides.length).toEqual(1);
      expect(activeSlides[0]).toEqual(index);
    }
    function getSlides() {return el.querySelectorAll('.item');}
    function getLeftArrow() {return el.querySelectorAll('a.left');}
    function getRightArrow() {return el.querySelectorAll('a.right');}
    function getDots() {return el.querySelectorAll('ol.carousel-indicators > li');}
    
    it('should set the selected slide to index 1', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          testSlideActive(0);
          cpt.index = 1;
          refresh();
          testSlideActive(1);
        });
      }));
      
    it('should create prev & next navigation arrows', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          expect(getLeftArrow().length).toEqual(1);
          expect(getRightArrow().length).toEqual(1);
        });
      }));
      
    it('should create slide indicators', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          expect(getDots().length).toEqual(3);
        });
      }));
      
    it('should hide navigation arrows when wrap is false', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({wrap: false}, tcb, async, (rootTC, refresh) => { 
          expect(getLeftArrow().length).toEqual(0);
          expect(getRightArrow().length).toEqual(1);
          cpt.index = 2;
          refresh();
          expect(getLeftArrow().length).toEqual(1);
          expect(getRightArrow().length).toEqual(0);
        });
      }));
      
    it('should hide navigation when only one slide', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({nbOfSlides: 1}, tcb, async, (rootTC, refresh) => { 
          expect(getSlides().length).toEqual(1);
          expect(getLeftArrow().length).toEqual(0);
          expect(getRightArrow().length).toEqual(0);
          expect(getDots().length).toEqual(0);
        });
      }));
      
    it('should not fail when no slides', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({nbOfSlides: 0}, tcb, async, (rootTC, refresh) => { 
          expect(getSlides().length).toEqual(0);
          expect(getLeftArrow().length).toEqual(0);
          expect(getRightArrow().length).toEqual(0);
          expect(getDots().length).toEqual(0);
        });
      }));
          
    it('should cycle forward', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          testSlideActive(0);

          cpt.next();
          refresh();
          testSlideActive(1);

          cpt.next();
          refresh();
          testSlideActive(2);

          cpt.next();
          refresh();
          testSlideActive(0);
        });
      }));

    it('should cycle backward',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          cpt.prev();
          refresh();
          testSlideActive(2);

          cpt.prev();
          refresh();
          testSlideActive(1);

          cpt.prev();
          refresh();
          testSlideActive(0);
        });
      }));
      
    it('should navigate to another slide',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          cpt.navigateTo(2);
          refresh();
          testSlideActive(2);
        });
      }));
  });
};

@Component({selector: 'test-cmp'})
@View({directives: [Carousel, CarouselSlide, CarouselCaption]})
class TestComponent {}