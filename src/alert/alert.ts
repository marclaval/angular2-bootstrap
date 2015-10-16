import {Component, ElementRef, NgIf, NgClass, EventEmitter} from 'angular2/angular2';

@Component({
  selector: 'alert',
  properties: ['type', 'dismissible', 'fade', 'opened'],
  events: ['closestart', 'closeend'],
  templateUrl: './alert/alert.html',
  directives: [NgIf, NgClass]
})
export class Alert {
  static alertTypes = ['success', 'info', 'warning', 'danger'];
  private _el: HTMLElement;
  private _transitionEnd: string = getTransitionEnd();
  private _dismissible: boolean = true;
  private _fade: boolean = getTransitionEnd() != null;
  private _in: boolean = true;
  private _type: string = Alert.alertTypes[3];
  private _opened: boolean = true;
  private closestart: EventEmitter = new EventEmitter();
  private closeend: EventEmitter = new EventEmitter();
  
  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }

  set dismissible(val: string | boolean) {
    this._dismissible = String(val) == "true";
  }
  
  set fade(val: string | boolean) {
    this._fade = this._in = String(val) != "false" && this._transitionEnd != null;
  }
  
  set type(val: string) {
    this._type = Alert.alertTypes.indexOf(val) !== -1 ? val : Alert.alertTypes[3];
  }
  
  set opened(val: string | boolean) {
    var opening = String(val) == "true";
    if (!opening && this._opened) {
      this.close();
    } else if (opening && !this._opened) {
      this._opened = true;
      this._fade = true;
      setTimeout(() => {
          this._in = true;
      }, 30);
    } 
  }

  close(): void {
    this.closestart.next(null);
    if (this._fade) {
      this._in = false;
      var endAnimationCallback = (event) => {
        this._el.removeEventListener(this._transitionEnd, endAnimationCallback, false);
        this._finalizeTransition();
      };
      this._el.addEventListener(this._transitionEnd, endAnimationCallback, false);
    } else {
      this._finalizeTransition();
    }
    
  }
  _finalizeTransition(): void {
    this._opened = false;
    this.closeend.next(null);
  }
}

// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
// ============================================================
function getTransitionEnd(): string {
    var el = document.createElement('angular2-bootstrap');
    var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
    };
    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return transEndEventNames[name];
        }
    }
    return null;
}