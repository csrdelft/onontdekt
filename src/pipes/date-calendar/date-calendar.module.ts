import { NgModule } from '@angular/core';

import { DateCalendarPipe } from './date-calendar';

@NgModule({
  declarations: [
    DateCalendarPipe
  ],
  exports: [
    DateCalendarPipe
  ]
})
export class DateCalendarPipeModule { }
