import { Directive, ElementRef, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';


@Directive({
  selector: '[csrSystemBrowser]'
})
export class SystemBrowserDirective {

  constructor(
    private el: ElementRef,
    private platform: Platform
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.platform.is('cordova')) {
      event.preventDefault();
      let url = this.el.nativeElement.getAttribute('href');
      new InAppBrowser(url, '_system');
    }
  }
}
