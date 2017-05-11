import { BBParsePipe } from './bb-parse/bb-parse';
import { BBStripPipe } from './bb-strip/bb-strip';
import { DateCalendarPipe } from './date-calendar/date-calendar';
import { DateFormatPipe } from './date-format/date-format';
import { GroupByPipe } from './group-by/group-by';

export const PIPES = [
  BBParsePipe,
  BBStripPipe,
  DateCalendarPipe,
  DateFormatPipe,
  GroupByPipe
];
