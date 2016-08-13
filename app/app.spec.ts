import { TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS, TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/testing';
import { setBaseTestProviders } from '@angular/core/testing';
import { LustrumApp } from './app';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

let lustrumApp: LustrumApp = null;

class MockClass {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public is(platform: string): boolean {
    return true;
  }

  public tryAuthentication(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public check(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public create(options: any): any {
    return new OverlayClass();
  }
}

class OverlayClass {
  public present(): any {
    return;
  }

  public dismiss(): any {
    return;
  }
}

describe('LustrumApp', () => {

  beforeEach(() => {
    let mockClass: any = (<any>new MockClass());
    lustrumApp = new LustrumApp(mockClass, mockClass, mockClass, mockClass, mockClass);
  });

  it('initialises with an app', () => {
    expect(lustrumApp['app']).not.toBe(null);
  });
});
