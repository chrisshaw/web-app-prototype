const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

    // This is the entry point or start of our react applicaton
    entry: ['babel-polyfill', "./app/app.js"],

    // The plain compiled JavaScript will be output into this file
    output: {
        filename: "public/bundle.js"
    },

    resolve: {
        extensions: [ '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            debug: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            debug: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    { 
                        loader: 'style-loader',
                        options: {
                            debug: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            debug: true
                        }
                    }
                ]
            },
            { 
                test: /\.(jpe?g|png|gif)$/, 
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            debug: true
                        }
                    }
                ]
            },
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },
            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['env', { debug: true }],
                        ['react'],
                        ['stage-0'],
                        ['stage-1']
                    ]
                }
            }
        ]
    },
    // This lets us debug our react code in chrome dev tools. Errors will have lines and file names
    // Without this the console says all errors are coming from just coming from bundle.js
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin("styles.css")
    ],
    devtool: "#eval-source-map",
    devServer: {
        contentBase: './public',
        hot: true,
        port: 9000,
        proxy: {
          "/": "http://localhost:8080"
        }
    }
};