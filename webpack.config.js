const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require('dotenv')

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    output: {
      filename: 'bundle.js',
      path: path.resolve('./build'),
      publicPath: '/',
    },
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                'babel-plugin-emotion',
                !isProduction && require('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        },
        {
          test: /\.(css|scss)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader"
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: isProduction
      ? [
          new MiniCssExtractPlugin(),
          new CleanWebpackPlugin(),
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            favicon: 'public/favicon.png',
            filename: 'index.html',
            inject: 'body',
          }),
        ]
      : [
          new ReactRefreshPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            favicon: 'public/favicon.png',
            filename: 'index.html',
            inject: 'body',
          }),
          new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed)
          })
        ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              // remove all comments except license related
              comments: /@license/i,
            },
            // prevent minification of class names and function names
            // mostly for production logging
            keep_classnames: true,
            keep_fnames: true,
          },
          // prevent extracting comments into [source filename].LICENSE.txt files
          extractComments: false,
        }),
      ],
    },

    devtool: !isProduction && 'eval-source-map',

    devServer: {
      contentBase: path.join(__dirname, 'build'),
      historyApiFallback: true,
      port: 3000,
      open: true,
      hot: true,
    },
  };
};
