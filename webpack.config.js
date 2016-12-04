module.exports = {
  cache: true,
  entry: './src/client/index.js',
  output: {
    filename: './dist/browser-bundle.js'
  },
  target: 'web',
//  devtool: 'eval-module-source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015-native-modules', 'react'],
          compact: "true"
        }
      },
    ]
  },
};
