import { NgModule } from '@angular/core';

import { BBStripPipe } from './bb-strip';

@NgModule({
  declarations: [
    BBStripPipe
  ],
  exports: [
    BBStripPipe
  ]
})
export class BBStripPipeModule { }
