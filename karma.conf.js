var webpack = require('./webpack.config.js')

module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome' ],
    singleRun: false,
    frameworks: ['jasmine'],
    reporters: [ 'dots' ],
    colors: true,

    files: [
      'lib/**/*_test.js',
    ],

    preprocessors: {
      'lib/**/*_test.js': ['webpack'],
    },

    webpack: {
      loaders: webpack.loaders,
    },

    webpackMiddleware: {
      noInfo: true,
    },
  })
}
