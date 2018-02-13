import { Directive, ElementRef, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';

import { UrlService } from '../../services/url.service';

@Directive({
  selector: '[csrSystemBrowser]'
})
export class SystemBrowserDirective {
  constructor(
    private el: ElementRef,
    private platform: Platform,
    private urlService: UrlService
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.platform.is('cordova')) {
      event.preventDefault();
      const url = this.el.nativeElement.getAttribute('href');
      this.urlService.open(url);
    }
  }
}
