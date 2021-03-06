const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "public"),
  entry: {
    // index: "index.js",
    // point: 'point.js',
    // vendor: [  
      // './script/react.min.15.4.2.js', './script/react-dom.min.15.4.2.js',
      // './script/react-router.min.2.8.1.js', './script/redux.min.3.6.0.js',
      // './script/moment.min.2.18.1.js', './script/moment-with-zh-cn.2.18.1.js','./api.js',
      // './crypto-js.js','./cookie.js',
      // './pointTran.js',
      //  './script/vendor.js', './script/app.js'
      // ],
    index: './index.js',
    point: './point.js',
    history: './history.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     moment: ["./moment.min.2.18.1.js","./moment-with-zh-cn.2.18.1.js"],
  //     CryptoJS: "./crypto-js.js",
  //   })
  // ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  //http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      template: './index.html',
      filename:  './index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './point.html',
      filename:  './point.html',
      chunks: ['point']
    }),
    new HtmlWebpackPlugin({
      template: './history.html',
      filename:  './history.html',
      chunks: ['history']
    })
  ])
}
