import { Pipe, PipeTransform } from '@angular/core';

import { BBParseService } from '../../providers/bb-parse';

@Pipe({
  name: 'csrBBParse'
})
export class BBParsePipe implements PipeTransform {
  constructor(private bbParse: BBParseService) {}

  transform(value: string, args: any[]): string {
    const parsed = this.bbParse.process({
      text: value,
      removeMisalignedTags: false,
      addInLineBreaks: false,
      escapeHtml: false
    });

    if (parsed.error) {
      console.warn(parsed.errorQueue);
    }

    return parsed.html;
  }
}
