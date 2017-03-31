import { CloudSettings } from '@ionic/cloud-angular';

/**
 * Config for Ionic Framework
 * https://ionicframework.com/docs/api/config/Config/
 */

export const ionicConfig = {
  preloadModules: true,
  tabbarLayout: 'title-hide',
  platforms: {
    android: {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      tabsHighlight: true
    },
    ios: {
      backButtonText: ''
    }
  }
};

/**
 * Config for Ionic Cloud services
 * https://docs.ionic.io/api/client/cloudsettings/
 */

export const cloudSettings: CloudSettings = {
  core: {
    app_id: 'b4141034'
  },
  push: {
    sender_id: '335763697269',
    pluginConfig: {
      android: {
        iconColor: '#1f5370',
        clearBadge: true
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        clearBadge: true
      }
    }
  },
  insights: {
    enabled: false
  }
};
