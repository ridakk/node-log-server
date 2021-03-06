const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'ui/dist');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
  entry: [path.join(__dirname, '/ui/src/app/app.js')],
  resolve: {
    // When require, do not have to add these extensions to file's name
    extensions: ['', '.js'],
    // node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: 'bundle.js', // Name of output file
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // supresses warnings, usually from module minification
        warnings: false,
      },
    }),
    // Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    // Transfer Files
    new TransferWebpackPlugin([{
      from: 'ui/src/www/build',
    }]),
  ],
  module: {
    preLoaders: [{
      test: /(\.jsx|\.js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules|ui\/dist|\.git/,
    }],
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: [nodeModulesPath],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    }],
  },
};

module.exports = config;
