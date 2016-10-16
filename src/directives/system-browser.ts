import { Directive, ElementRef, HostListener } from '@angular/core';
import { InAppBrowser } from 'ionic-native';


@Directive({
  selector: '[csrSystemBrowser]'
})
export class SystemBrowserDirective {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @HostListener('click') onClick($event) {
    $event.preventDefault();
    let url = this.el.getAttribute('href');
    InAppBrowser.open(url, '_system');
  }
}
