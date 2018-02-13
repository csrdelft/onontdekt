import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { UrlService } from '../../services/url.service';

@Directive({
  selector: '[csrMapsHref]'
})
export class MapsHrefDirective implements OnInit {
  @Input('csrMapsHref') csrMapsHref: string;

  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private urlService: UrlService
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    const url = this.urlService.getMapsUrl(this.csrMapsHref);
    this.el.setAttribute('href', url);
  }
}
