import {Component, View} from 'angular2/angular2';
import {Alert} from 'alert/alert';

@Component({
  selector: 'demo-alert'
})
@View({
  templateUrl: './samples/alert/demo-alert.html',
  directives: [Alert]
})
export class DemoAlert {
  private alertOpened: boolean = true;
  
  close(evt: MouseEvent) {
    evt.preventDefault();
    this.alertOpened = false;
  }
  
  log(msg: string) {
    console.log(msg);
  }
  
  toggle() {
    this.alertOpened = !this.alertOpened;
  }
}