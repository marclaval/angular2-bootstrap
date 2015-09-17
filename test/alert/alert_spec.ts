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
import {Component, View} from 'angular2/angular2';
import {Alert} from 'src/alert/alert';

export function main() {
  describe('Alert', () => {
    var cpt : Alert = null;
    var el : HTMLElement = null;
    var clock;
    
    beforeEach(function(){
       clock = sinon.useFakeTimers();
    });
    afterEach(function() {
      clock.restore();
    });
    
    function runTest({type = "danger", fade = false, opened = true, dismissable = true}, tcb, async, cb) {
      var html = `<alert type="${type}" fade="${fade}" opened="${opened}" dismissable="${dismissable}" (closestart)="onCloseStart()" (closeend)="onCloseEnd()">`;
      html += 'I am an alert without any closing transition - close me and I just disappear!';
      html +='</alert';
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
    
    function getAlert() {
        return el.querySelectorAll("div.alert");
    }
    function getCloseButton() {
        return el.querySelectorAll("button.close");
    }
    
    it('should display an alert with dynamic type and close button', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          expect(getCloseButton().length).toEqual(1);
          expect((<HTMLElement>getAlert()[0]).className.indexOf("alert-danger") > -1).toBeTruthy();
          
          cpt.type = "info";
          refresh();
          expect(getCloseButton().length).toEqual(1);
          expect((<HTMLElement>getAlert()[0]).className.indexOf("alert-info") > -1).toBeTruthy();
          
          cpt.dismissible = false;
          refresh();
          expect(getCloseButton().length).toEqual(0);
          expect((<HTMLElement>getAlert()[0]).className.indexOf("alert-info") > -1).toBeTruthy();
        });
      }));
      
    it('should close the alert when clicking the close button', 
      inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
        runTest({}, tcb, async, (rootTC, refresh) => {
          sinon.spy(rootTC.componentInstance, "onCloseStart");
          sinon.spy(rootTC.componentInstance, "onCloseEnd");
          
          expect(getAlert().length).toBe(1);
          expect(rootTC.componentInstance.onCloseStart.called).toBeFalsy();
          expect(rootTC.componentInstance.onCloseEnd.called).toBeFalsy();
          
          cpt.close();
          refresh();
          clock.tick(0);
          expect(getAlert().length).toBe(0);
          expect(rootTC.componentInstance.onCloseStart.callCount).toBe(1);
          expect(rootTC.componentInstance.onCloseEnd.callCount).toBe(1);
          
          cpt.opened = true;
          refresh();
          clock.tick(0);
          expect(getAlert().length).toBe(1);
          expect(rootTC.componentInstance.onCloseStart.callCount).toBe(1);
          expect(rootTC.componentInstance.onCloseEnd.callCount).toBe(1);
        });
      }));
	  
  });
}

@Component({selector: 'test-cmp'})
@View({directives: [Alert]})
class TestComponent {
  onCloseStart() {}
  onCloseEnd() {}
}