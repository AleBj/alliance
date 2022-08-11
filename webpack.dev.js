const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => merge(common(env), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer:{
    static : {
      directory : path.join(__dirname, "/")
    },
    port: 8899,
    devMiddleware:{
       publicPath: "https://localhost:8899/",
    },
    hot: "only",
  }
});