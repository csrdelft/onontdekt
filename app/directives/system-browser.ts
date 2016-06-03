import { Directive, ElementRef } from '@angular/core';
import { InAppBrowser } from 'ionic-native';


@Directive({
  selector: '[systemBrowser]',
  host: {
    '(click)': 'onClick($event)'
  }
})
export class SystemBrowser {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  onClick($event) {
    $event.preventDefault();
    let url = this.el.getAttribute('href');
    InAppBrowser.open(url, '_system');
  }
}
