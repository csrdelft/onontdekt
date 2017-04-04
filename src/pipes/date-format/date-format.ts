import { Pipe, PipeTransform } from '@angular/core';

import { formatLocale } from '../../util/dates';

@Pipe({
  name: 'csrDateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(date: Date, format: string): string {
    return formatLocale(date, format);
  }
}
