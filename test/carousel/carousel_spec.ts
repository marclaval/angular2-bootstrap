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
  dispatchEvent
} from 'angular2/test';
import {Component, View, NgIf} from 'angular2/angular2';
import {Carousel, CarouselSlide, CarouselCaption} from 'src/carousel/carousel';
import {DOM} from 'angular2/src/core/dom/dom_adapter';

export function main() {
  describe('Carousel', () => {
    var cpt : Carousel = null;
    var el : HTMLElement = null;
    var clock;
    
    beforeEach(function(){
       clock = sinon.useFakeTimers();
    });
    afterEach(function() {
      clock.restore();
    });

    function runTest({nbOfSlides = 3, index = 0, interval = 1000, noTransition = true, pause = "hover", wrap = true}, tcb, async, cb) {
      var html = `<carousel index="${index}" interval="${interval}" no-transition="${noTransition}" pause="${pause}" wrap="${wrap}"`;
      html += ' (indexchange)="onIndexChange($event)" (slidestart)="onSlideStart()" (slideend)="onSlideEnd()">'
      for (var i = 0; i < nbOfSlides; i++) {
        html += `<carousel-slide><div>${i+1}</div></carousel-slide>`;
      }
      html += '<carousel-slide template="ng-if moreSlide"><div>a</div></carousel-slide>';
      html += '</carousel>';
      tcb.overrideTemplate(TestComponent, html)
        .createAsync(TestComponent)
        .then((rootTC) => {
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
          
          cpt.index = 0;
          refresh();
          testSlideActive(0);
        });
      }));
      
    it('should not go forward if interval is negative',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          clock.tick(1500);
          refresh();
          testSlideActive(1);
          
          cpt.interval = -1;
          clock.tick(1500);
          refresh();
          testSlideActive(1);
          
          cpt.interval = 1000;
          clock.tick(1500);
          refresh();
          testSlideActive(2);
        });
      }));
    
    it('should be playing by default and cycle through slides',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          clock.tick(1500);
          refresh();
          testSlideActive(1);
          
          clock.tick(1000);
          refresh();
          testSlideActive(2);
          
          clock.tick(1000);
          refresh();
          testSlideActive(0);
        });
      }));
      
    it('should pause and play on mouse over',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          clock.tick(1500);
          refresh();
          testSlideActive(1);
          
          DOM.dispatchEvent(el, DOM.createMouseEvent('mouseenter'));
          clock.tick(1000);
          refresh();
          testSlideActive(1);
          
          DOM.dispatchEvent(el, DOM.createMouseEvent('mouseleave'));
          clock.tick(1000);
          refresh();
          testSlideActive(2);
        });
      }));
      
    it('should not pause and play on mouse over when pause is not set to hover',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({pause: null}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          clock.tick(1500);
          refresh();
          testSlideActive(1);
          
          DOM.dispatchEvent(el, DOM.createMouseEvent('mouseenter'));
          clock.tick(1000);
          refresh();
          testSlideActive(2);
          
          DOM.dispatchEvent(el, DOM.createMouseEvent('mouseleave'));
          clock.tick(1000);
          refresh();
          testSlideActive(0);
        });
      }));
      
    //TODO: rewrite when slide order issue is fixed
    it('should remove slide from dom and change active slide',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {      
          expect(getSlides().length).toEqual(3);

          rootTC.componentInstance.moreSlide = true;
          refresh();
          expect(getSlides().length).toEqual(4);
        });
      }));
      
    it('should not cycle when wrap=false',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({wrap: false}, tcb, async, (rootTC, refresh) => {      
          testSlideActive(0);

          cpt.prev();
          refresh();
          testSlideActive(0);
          
          cpt.index = 2;
          refresh();
          testSlideActive(2);
          
          cpt.next();
          refresh();
          testSlideActive(2);
          
          clock.tick(1500);
          refresh();
          testSlideActive(2);
        });
      }));
      
    it('should raise events during each transition',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          sinon.spy(rootTC.componentInstance, "onIndexChange");   
          sinon.spy(rootTC.componentInstance, "onSlideStart");
          sinon.spy(rootTC.componentInstance, "onSlideEnd");
          
          expect(rootTC.componentInstance.onIndexChange.called).toBeFalsy();
          expect(rootTC.componentInstance.onSlideStart.called).toBeFalsy();
          expect(rootTC.componentInstance.onSlideEnd.called).toBeFalsy();

          cpt.next();
          refresh();
          clock.tick(0);
          expect(rootTC.componentInstance.onIndexChange.callCount).toBe(1);
          expect(rootTC.componentInstance.onSlideStart.callCount).toBe(1);
          expect(rootTC.componentInstance.onSlideEnd.callCount).toBe(1);
          
          cpt.next();
          refresh();
          clock.tick(0);
          expect(rootTC.componentInstance.onIndexChange.callCount).toBe(2);
          expect(rootTC.componentInstance.onSlideStart.callCount).toBe(2);
          expect(rootTC.componentInstance.onSlideEnd.callCount).toBe(2);
          
          cpt.next();
          refresh();
          clock.tick(0);
          expect(rootTC.componentInstance.onIndexChange.callCount).toBe(3);
          expect(rootTC.componentInstance.onSlideStart.callCount).toBe(3);
          expect(rootTC.componentInstance.onSlideEnd.callCount).toBe(3);
        });
      }));
  });
};

@Component({selector: 'test-cmp'})
@View({directives: [NgIf, Carousel, CarouselSlide, CarouselCaption]})
class TestComponent {
  moreSlide: boolean = false;
  onIndexChange() {}
  onSlideStart() {}
  onSlideEnd() {}
}