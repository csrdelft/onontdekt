import { NgModule } from '@angular/core';

import { BBParsePipe } from './bb-parse';

@NgModule({
  declarations: [
    BBParsePipe
  ],
  exports: [
    BBParsePipe
  ]
})
export class BBParsePipeModule { }
