/**
 * Provider for angular2-jwt until they provide an ngModule
 */

import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'X-Csr-Authorization'
  }), http, options);
}

const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authFactory
};

/**
 * Providers for Ionic Native
 */

import { Calendar } from '@ionic-native/calendar';
import { CodePush } from '@ionic-native/code-push';
import { Contacts } from '@ionic-native/contacts';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { OneSignal } from '@ionic-native/onesignal';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

const ionicNativeProviders = [
  Calendar,
  CodePush,
  Contacts,
  GoogleAnalytics,
  InAppBrowser,
  Keyboard,
  OneSignal,
  PhotoViewer,
  SafariViewController,
  SplashScreen,
  StatusBar
];

/**
 * Custom app services
 */

import { ApiService } from '../providers/api';
import { AuthService } from '../providers/auth';
import { BBParseService } from '../providers/bb-parse';
import { HttpService } from '../providers/http';
import { NotificationService } from '../providers/notification';
import { UrlService } from '../providers/url';

const services = [
  ApiService,
  AuthService,
  BBParseService,
  HttpService,
  NotificationService,
  UrlService
];

/**
 * Export all providers for use in our app module
 */

export const providers = [
  ionicNativeProviders,
  services,
  authProvider
];
