const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: []
};


var config;
switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common,
      parts.setupCSS(PATHS.app),
      parts.setupBabel(),
      parts.minify(),
      parts.setFreeVariable('process.env.NODE_ENV', 'production'));
    break;
  default:
    config = merge(
      common,
      parts.setupCSS(PATHS.app),
      parts.setupBabel(),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}
module.exports = validate(config);