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

    function runTest(tcb, async, cb) {
      var html = `
      <carousel index="0" no-transition="true">
        <carousel-slide><div>1</div></carousel-slide>
        <carousel-slide><div>2</div></carousel-slide>
        <carousel-slide><div>3</div></carousel-slide>
      </carousel>`;
      tcb.overrideTemplate(TestComponent, html)
        .createAsync(TestComponent)
        .then((rootTC) => {
          rootTC._componentParentView.changeDetector.detectChanges();
          rootTC._componentParentView.changeDetector.detectChanges();
          cpt = rootTC.componentViewChildren[0].componentInstance;
          el = rootTC.componentViewChildren[0].nativeElement;       
          cb(rootTC);
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

    it('should cycle forward', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest(tcb, async, (rootTC) => {
          testSlideActive(0);

          cpt.next();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(1);

          cpt.next();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(2);

          cpt.next();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(0);
        });
      }));

    it('should cycle backward',
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
        runTest(tcb, async, (rootTC) => {      
          testSlideActive(0);

          cpt.prev();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(2);

          cpt.prev();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(1);

          cpt.prev();
          rootTC._componentParentView.changeDetector.detectChanges();
          testSlideActive(0);
        });
      }));
  });
};

@Component({selector: 'test-cmp'})
@View({directives: [Carousel, CarouselSlide, CarouselCaption]})
class TestComponent {}