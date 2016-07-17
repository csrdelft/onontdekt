import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';


@Directive({
  selector: '[csrMapsHref]'
})
export class MapsHrefDirective implements OnInit {
  @Input('csrMapsHref') csrMapsHref: string;

  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private platform: Platform
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    let query = encodeURIComponent(this.csrMapsHref);
    let url = this.getPlatformMapsUrl();
    this.el.setAttribute('href', url + query);
  }

  private getPlatformMapsUrl(): string {
    if (this.platform.is('mobile')) {
      if (this.platform.is('ios')) {
        return 'maps://maps.apple.com/?q=';
      } else {
        return 'geo:0,0?q=';
      }
    } else {
      return 'https://maps.google.com?q=';
    }
  }
}
