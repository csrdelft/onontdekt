import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BBParseService } from '../../services/bb-parse/bb-parse';

@Pipe({
  name: 'csrBBParse'
})
export class BBParsePipe implements PipeTransform {
  constructor(
    private bbParse: BBParseService,
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string, args: any[]): SafeHtml {
    const parsed = this.bbParse.process({
      text: value,
      removeMisalignedTags: false,
      addInLineBreaks: false,
      escapeHtml: false
    });

    // if (parsed.error) {
    //   console.error(parsed.errorQueue);
    // }

    return this.sanitizer.bypassSecurityTrustHtml(parsed.html);
  }
}
