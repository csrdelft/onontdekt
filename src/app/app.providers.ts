/**
 * Providers for Ionic Native
 */

import { Calendar } from '@ionic-native/calendar';
import { CodePush } from '@ionic-native/code-push';
import { Contacts } from '@ionic-native/contacts';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { SplashScreen } from '@ionic-native/splash-screen';

const ionicNativeProviders = [
  Calendar,
  CodePush,
  Contacts,
  InAppBrowser,
  Keyboard,
  PhotoViewer,
  SafariViewController,
  SplashScreen
];

/**
 * Custom app services
 */

import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';
import { NotificationService } from '../services/notification.service';
import { UrlService } from '../services/url.service';

const SERVICES = [
  ApiService,
  AuthService,
  JwtService,
  NotificationService,
  UrlService
];

/**
 * Interceptors
 */

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateInterceptor } from '../interceptors/date.interceptor';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';

const INTERCEPTORS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DateInterceptor,
    multi: true
  }
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
  ...SERVICES,
  ...INTERCEPTORS,
  ...ionicNativeProviders,
  errorProvider
];
