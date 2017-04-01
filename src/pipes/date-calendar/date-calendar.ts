import { Pipe, PipeTransform } from '@angular/core';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

import { formatLocale } from '../../util/dates';

export interface DateCalendarFormats {
  sameDay: string;
  lastDay: string;
  lastWeek: string;
  sameElse: string;
}

@Pipe({
  name: 'csrDateCalendar'
})
export class DateCalendarPipe implements PipeTransform {
  transform(date: Date, formats: DateCalendarFormats): string {
    let format: string;

    if (isToday(date)) {
      format = formats.sameDay;
    } else if (isYesterday(date)) {
      format = formats.lastDay;
    } else if (differenceInCalendarDays(new Date(), date) < 7) {
      format = formats.lastWeek;
    } else {
      format = formats.sameElse;
    }

    return formatLocale(date, format);

  }
}
