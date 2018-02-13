import {
  DomController,
  GestureController,
  PanGesture,
  Platform
} from 'ionic-angular';

import { AlphabetScrollComponent } from './alphabet-scroll';

export class AlphabetGesture extends PanGesture {
  private currentLetter: null | string = null;

  constructor(
    plt: Platform,
    private alphabetScroll: AlphabetScrollComponent,
    gestureCtrl: GestureController,
    domCtrl: DomController
  ) {
    super(plt, alphabetScroll.getGestureElement(), {
      maxAngle: 10,
      threshold: 5,
      direction: 'y',
      zone: false,
      domController: domCtrl,
      gesture: gestureCtrl.createGesture({
        name: 'alphabet',
        priority: 40,
        disableScroll: false
      })
    });
  }

  onDragMove(ev: TouchEvent) {
    ev.preventDefault();

    const coord = pointerCoord(ev);
    const ele = document.elementFromPoint(coord.x, coord.y) as HTMLElement;
    if (ele && ele.tagName === 'A') {
      const letter = ele.innerText;
      if (this.currentLetter === null || this.currentLetter !== letter) {
        this.currentLetter = letter;
        this.alphabetScroll.scrollTo(letter);
      }
    }
  }

  onDragEnd(ev: TouchEvent) {
    ev.preventDefault();

    this.currentLetter = null;
  }

  destroy() {
    super.destroy();

    this.currentLetter = null;
  }
}

function pointerCoord(ev: TouchEvent): { x: number; y: number } {
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
  }
  return { x: 0, y: 0 };
}
