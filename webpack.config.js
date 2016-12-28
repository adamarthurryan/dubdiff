let config = {
  cache: true,
  entry: './src/client/index.js',
  output: {
    filename: './dist/browser-bundle.js'
  },
  target: 'web',

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
      { test: /\.json$/, loader: "json-loader" },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};

if (process.env.NODE_ENV == "production") {
  config.devtool = "cheap-module-source-map"
}
else {
  config.devtool = "eval"
}

module.exports = config;
