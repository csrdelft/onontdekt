import { Directive, ElementRef, HostListener } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';


@Directive({
  selector: '[csrSystemBrowser]'
})
export class SystemBrowserDirective {

  constructor(
    private el: ElementRef,
    private inAppBrowser: InAppBrowser,
    private platform: Platform
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.platform.is('cordova')) {
      event.preventDefault();
      let url = this.el.nativeElement.getAttribute('href');
      this.inAppBrowser.create(url, '_system');
    }
  }
}
