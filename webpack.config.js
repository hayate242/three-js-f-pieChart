module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: ['@babel/polyfill', './public/assets/main-js/bundle.js'], // polyfill はIE11などで必要
  output: {
    path: `${__dirname}/public/assets/main-js`,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};