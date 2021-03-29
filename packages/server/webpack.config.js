const webpack = require('webpack');
const path = require('path');
var fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * This will allow webpack to find Express and other dependencies.
 * In the future, a better solution should be found.
 *
 * @link {https://archive.jlongster.com/Backend-Apps-with-Webpack--Part-I}
 */
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
    ]
  }
};

module.exports = config;