import { NgModule } from '@angular/core';

import { SystemBrowserDirective } from './system-browser';

@NgModule({
  declarations: [
    SystemBrowserDirective
  ],
  exports: [
    SystemBrowserDirective
  ]
})
export class SystemBrowserDirectiveModule { }
