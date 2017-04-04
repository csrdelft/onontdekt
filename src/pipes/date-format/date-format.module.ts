import { NgModule } from '@angular/core';

import { DateFormatPipe } from './date-format';

@NgModule({
  declarations: [
    DateFormatPipe
  ],
  exports: [
    DateFormatPipe
  ]
})
export class DateFormatPipeModule { }
