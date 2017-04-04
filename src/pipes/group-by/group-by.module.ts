import { NgModule } from '@angular/core';

import { GroupByPipe } from './group-by';

@NgModule({
  declarations: [
    GroupByPipe
  ],
  exports: [
    GroupByPipe
  ]
})
export class GroupByPipeModule { }
