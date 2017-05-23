import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Host } from '@angular/core';
import { Content } from 'ionic-angular';

declare var Hammer: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-alphabet-scroll',
  templateUrl: 'alphabet-scroll.html'
})
export class AlphabetScrollComponent implements AfterViewInit {

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    @Host() private content: Content,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    this.setupPanRecognizer();
  }

  scrollTo(letter: string) {
    const content = this.content.getElementRef().nativeElement as HTMLElement;
    const group = content.querySelector('.scroll-letter-' + letter);
    if (group) {
      group.scrollIntoView(true);
    }
  }

  private setupPanRecognizer() {
    const mc = new Hammer(this.elementRef.nativeElement, {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
      ]
    });

    mc.on('panup pandown', (e: any) => {
      const closestEle = document.elementFromPoint(e.center.x, e.center.y) as HTMLElement;
      if (closestEle && closestEle.tagName === 'A') {
        const letter = closestEle.innerText;
        this.scrollTo(letter);
      }
    });
  }
}
