const webpack = require('webpack')

module.exports = {

    // This is the entry point or start of our react applicaton
    entry: "./app/app.js",

    // The plain compiled JavaScript will be output into this file
    output: {
        filename: "public/bundle.js"
    },

    resolve: {
        extensions: [ '.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
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
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['env', { debug: true }],
                        ['react'],
                        ['stage-0']
                    ],
                    plugins: [
                        'transform-decorators-legacy'
                    ]
                }
            }
        ]
    },
    // This lets us debug our react code in chrome dev tools. Errors will have lines and file names
    // Without this the console says all errors are coming from just coming from bundle.js
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
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