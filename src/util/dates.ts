import formatDate from 'date-fns/format';
import nlLocale from 'date-fns/locale/nl';

export function formatLocale(date: Date, format: string): string {
  return formatDate(date, format, { locale: nlLocale });
}

export function isFullDay(start: Date, end: Date): boolean {
  const isStart = start.getHours() === 0 && start.getMinutes() === 0;
  const isEnd = end.getHours() === 23 && end.getMinutes() === 59;
  return isStart && isEnd;
}
