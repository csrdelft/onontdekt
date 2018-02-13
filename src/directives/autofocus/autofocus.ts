import { AfterViewInit, Directive, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';

@Directive({
  selector: '[csrAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(
    private renderer: Renderer,
    private elementRef: ElementRef,
    private keyboard: Keyboard,
    private platform: Platform
  ) {}

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    if (!element) {
      return;
    }

    setTimeout(() => {
      if (element.value && element.value.length > 0) {
        return;
      }
      this.renderer.invokeElementMethod(element, 'focus', []);
      if (this.platform.is('cordova')) {
        this.keyboard.show();
      }
    }, 800);
  }
}
