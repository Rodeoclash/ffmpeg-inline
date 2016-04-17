var webpack = require('./webpack.config.js')

var configuration = {
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

  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox']
    }
  },

}

if (process.env.TRAVIS) {
  configuration.browsers = ['Chrome_travis_ci']
}

module.exports = function(config) {
  config.set(configuration)
}
