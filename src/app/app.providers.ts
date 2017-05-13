/**
 * Provider for angular2-jwt until they provide an ngModule
 */

import { Http, RequestOptions } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
    tokenGetter: () => localStorage.getItem('id_token') !,
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

import { ApiService } from '../services/api/api';
import { AuthService } from '../services/auth/auth';
import { BBParseService } from '../services/bb-parse/bb-parse';
import { HttpService } from '../services/http/http';
import { NotificationService } from '../services/notification/notification';
import { UrlService } from '../services/url/url';

const SERVICES = [
  ApiService,
  AuthService,
  BBParseService,
  HttpService,
  NotificationService,
  UrlService
];

/**
 * Ionic error handler
 */

import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

const errorProvider = {
  provide: ErrorHandler,
  useClass: IonicErrorHandler
};

/**
 * Export all providers for use in our app module
 */

export const PROVIDERS = [
  SERVICES,
  ionicNativeProviders,
  authProvider,
  errorProvider
];
