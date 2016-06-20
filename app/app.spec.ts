import { ADDITIONAL_TEST_BROWSER_PROVIDERS, TEST_BROWSER_STATIC_PLATFORM_PROVIDERS } from '@angular/platform-browser/testing/browser_static';
import { BROWSER_APP_DYNAMIC_PROVIDERS } from '@angular/platform-browser-dynamic';
import { resetBaseTestProviders, setBaseTestProviders } from '@angular/core/testing';
import { LustrumApp } from './app';

resetBaseTestProviders();
setBaseTestProviders(
  TEST_BROWSER_STATIC_PLATFORM_PROVIDERS,
  [
    BROWSER_APP_DYNAMIC_PROVIDERS,
    ADDITIONAL_TEST_BROWSER_PROVIDERS,
  ]
);

let lustrumApp: LustrumApp = null;

class MockClass {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

describe('LustrumApp', () => {

  beforeEach(() => {
    let mockClass: any = (<any>new MockClass());
    lustrumApp = new LustrumApp(mockClass, mockClass, mockClass, mockClass);
  });

  it('initialises with an app', () => {
    expect(lustrumApp['app']).not.toBe(null);
  });
});
