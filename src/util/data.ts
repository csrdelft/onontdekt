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
    value = value.replace(' ', 'T');
    return new Date(value);
  }

  return value;
}

export function isNumeric(input: any): boolean {
  return !isNaN(input);
}
