const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => { 
  return {  
    entry: { 
      'home': ['./js/pages/home.page.js'],
      'solutions': ['./js/pages/solutions.page.js'],
      'about': ['./js/pages/about.page.js'],
      'sustainability': ['./js/pages/sustainability.page.js'],
      'contact': ['./js/pages/contact.page.js'],
      'integration': ['./js/components/integration.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: '[name].js'
    },
    plugins: [
      new MiniCssExtractPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: { 
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      ie: '11',
                    },
                  },
                ]
              ],
              plugins: ["@babel/plugin-transform-runtime"]
            }
          },
          exclude: /node_modules|js\/components\/integration\.js/,
        },
        {
          test: /node_modules(?:\/|\\)lit-element|lit-html/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader", // translates CSS into CommonJS
            {
              loader: 'sass-loader',
              options: {
                data: `
                  $env: "${env.NODE_ENV}";
                  ${env.NODE_ENV === 'development' ? "@import '../styles.scss';@import '../integration.scss';@import '../components/overlay.scss';" : ''}
                `,
                outputStyle: env.NODE_ENV === 'production' ? 'expanded' : 'compressed',
                sassOptions: {
                  outputStyle: env.NODE_ENV === 'production' ? 'expanded' : 'compressed',
                }
              },
            },
          ],
          exclude: /node_modules/
        },
        // {
        //   test: /\.(jpe?g|png|woff|woff2|eot|ttf|otf|svg|mp3)(\?[a-z0-9=.]+)?$/, 
        //   loader: 'file-loader',
        //   options: {
        //     name: '[path][name].[ext]',
        //     publicPath: './',
        //     context: path.resolve(__dirname, "./"),
        //     useRelativePaths: true
        //   }
        // },
        {
          test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
          type: 'asset/resource',
        },
      ]
    }
  }
}