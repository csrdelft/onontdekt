import { Pipe, PipeTransform } from '@angular/core';

import { BBParseService } from '../services/bb-parse';

@Pipe({
  name: 'csrBBCode'
})
export class BBCodePipe implements PipeTransform {
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
