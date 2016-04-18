module.exports = {
  entry: "./lib/ffmpeg-inline.js",
  output: {
    path: __dirname + '/dist',
    filename: "ffmpeg-inline.js",
    library: 'ffmpeg',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
