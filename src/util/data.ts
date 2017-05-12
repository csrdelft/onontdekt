import { Response } from '@angular/http';

export function parseJsonDates(res: Response): any {
  try {
    const text = res.text();
    return JSON.parse(text, reviveDateTime);
  } catch (error) {
    return {};
  }
}

export function reviveDateTime(key: any, value: any): any {
  // Server returns datetimes in the following format: '2017-05-09 18:30:00'
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\d\ \d\d:\d\d:\d\d$/.test(value)) {
    const year = Number(value.substr(0, 4));
    const month = Number(value.substr(5, 2)) - 1;
    const date = Number(value.substr(8, 2));
    const hours = Number(value.substr(11, 2));
    const minutes = Number(value.substr(14, 2));
    const seconds = Number(value.substr(17, 2));
    return new Date(year, month, date, hours, minutes, seconds);
  }

  return value;
}

export function isNumeric(input: any): boolean {
  return !isNaN(input);
}
