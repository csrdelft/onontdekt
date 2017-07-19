const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const ENV = process.env.IONIC_ENV;
const envConfigFile = require(`../environments/${ENV}.json`);

webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    webpackGlobalVars: {
      env: JSON.stringify(envConfigFile)
    }
  })
);
