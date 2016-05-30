import { ADDITIONAL_TEST_BROWSER_PROVIDERS, TEST_BROWSER_STATIC_PLATFORM_PROVIDERS } from '@angular/platform-browser/testing/browser_static';
import { BROWSER_APP_DYNAMIC_PROVIDERS } from '@angular/platform-browser-dynamic';
import { resetBaseTestProviders, setBaseTestProviders } from '@angular/core/testing';
import { LustrumApp } from './app';
import { TutorialPage } from './pages/tutorial/tutorial';
import { TabsPage } from './pages/tabs/tabs';

resetBaseTestProviders();
setBaseTestProviders(
  TEST_BROWSER_STATIC_PLATFORM_PROVIDERS,
  [
    BROWSER_APP_DYNAMIC_PROVIDERS,
    ADDITIONAL_TEST_BROWSER_PROVIDERS,
  ]
);

let lustrumApp: LustrumApp = null;

class MockPlatform {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

class MockAuthService {
  authenticated: boolean;

  constructor(authenticated: boolean) {
    this.authenticated = authenticated;
  }

  public tryAuthentication(): any {
    return new Promise((resolve: Function) => {
      resolve(this.authenticated);
    });
  }
}

describe('LustrumApp', () => {

  beforeEach(() => {
    let mockPlatform: any = (<any>new MockPlatform());
    let mockAuthService: any = (<any>new MockAuthService(false));
    lustrumApp = new LustrumApp(mockPlatform, mockAuthService);
  });

  it('initialises with tutorial when not authenticated', () => {
    expect(lustrumApp['rootPage']).toBe(TutorialPage);
  });

  it('initialises with tabs when authenticated', () => {
    lustrumApp = new LustrumApp(<any>new MockPlatform(), <any>new MockAuthService(true));
    expect(lustrumApp['rootPage']).toBe(TabsPage);
  });

  it('initialises with an app', () => {
    expect(lustrumApp['app']).not.toBe(null);
  });
});
