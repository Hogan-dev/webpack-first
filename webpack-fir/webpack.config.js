const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const webpack = require('webpack');
module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js',
    publicPath: '/' //通常是CDN地址
  },
  mode: isDev ? 'development' : 'production',
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr:isDev,
              reloadAll: true
            }
          },
          'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('autoprefixer')()
                ]
              }
            }
          }, 'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10k
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      config: config.template
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html',
      chunks: ['login']
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: 'public/js/*.js',
      to: path.resolve(__dirname, 'dist', 'js'),
      flatten: true
    }],{
      ignore: ['other.js']
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      Componeng: ['react', 'Component'],
      Vue: ['vue/dist/vue.esm.js', 'default'],
      $: 'jquery',
      _map: ['lodash', 'map']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    port: '3000', //默认是8000
    quiet: false, //默认不启用
    inline: true, //默认开启inline模式
    stats: "errors-only", //终端仅打印error
    overlay: false, //默认不启用 
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用gzip压缩
  },
  resolve:{
    module: ['./src/components', 'node_modules'],
    extensions: ['web.js', '.js', '.json', '.scss', '.less', '.css', '.jsx']
  }
}