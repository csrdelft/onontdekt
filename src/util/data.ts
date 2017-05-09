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
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\d\ \d\d:\d\d:\d\d$/.test(value)) {
    return new Date(value);
  }

  return value;
}
