module.exports = {
  entry: "./lib/ffmpeg-inline.js",
  output: {
    path: __dirname + '/dist',
    filename: "ffmpeg-inline.js",
    library: 'ffmpeg',
    libraryTarget: 'umd'
  },
  module: {
    //loaders: [
    //  { test: /\.css$/, loader: "style!css" },
    //]
  }
};
