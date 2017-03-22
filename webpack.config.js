var webpack = require('webpack');

module.exports = {
  entry: './js/snake.js',
  output: {
    filename: './js/snake.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
