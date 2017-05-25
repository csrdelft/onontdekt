import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Host, OnDestroy } from '@angular/core';
import { Content, DomController, GestureController, Platform } from 'ionic-angular';

import { AlphabetGesture } from './alphabet-gesture';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-alphabet-scroll',
  templateUrl: 'alphabet-scroll.html'
})
export class AlphabetScrollComponent implements AfterViewInit, OnDestroy {

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  private alphabetGesture: AlphabetGesture;

  constructor(
    @Host() private content: Content,
    private domCtrl: DomController,
    private elementRef: ElementRef,
    private gestureCtrl: GestureController,
    private platform: Platform
  ) {}

  ngAfterViewInit() {
    this.content.getScrollElement().style.right = '18px';

    this.alphabetGesture = new AlphabetGesture(this.platform, this, this.gestureCtrl, this.domCtrl);
    this.alphabetGesture.listen();
  }

  ngOnDestroy() {
    if (this.alphabetGesture) {
      this.alphabetGesture.destroy();
    }
  }

  scrollTo(letter: string) {
    const content = this.content.getScrollElement();
    const group = content.querySelector('.scroll-letter-' + letter) as HTMLElement;
    if (group) {
      group.scrollIntoView(true);
    }
  }

  getGestureElement() {
    return (this.elementRef.nativeElement as HTMLElement).children[0] as HTMLElement;
  }
}
