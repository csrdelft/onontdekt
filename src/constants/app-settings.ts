import { isDevMode } from '@angular/core';

export class AppSettings {
  static get API_ENDPOINT(): string {
    return isDevMode() ? '/api-proxy' : 'https://csrdelft.nl/API/2.0';
  }
}
