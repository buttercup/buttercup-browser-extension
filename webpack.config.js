const path = require("path");

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");

const SRC_BACKGROUND = path.resolve(SOURCE, "background");
const SRC_POPUP = path.resolve(SOURCE, "popup");
const SRC_SETUP = path.resolve(SOURCE, "setup");
const SRC_TAB = path.resolve(SOURCE, "tab");
const SRC_COMMON = path.resolve(SOURCE, "common");

const imageWebpackLoader = {
    pngquant: {
        quality: "65-90",
        speed: 4
    }
};


module.exports = [

    // Background
    {
        entry: path.resolve(SRC_BACKGROUND, "index.js"),
        output: {
            filename: "background.js",
            path: DIST
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel'
                }
            ]
        },
        resolve: {
            extensions: ['', '.js'],
            fallback: [path.join(__dirname, 'node_modules')]
        }
    },

    // Tab
    {
        entry: path.resolve(SRC_TAB, "index.js"),
        output: {
            filename: "tab.js",
            path: DIST
        },
        imageWebpackLoader,
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel'
                },
                {
                    test: /\.png$/i,
                    loaders: [
                        "url-loader",
                        "image-webpack"
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    loader: "url-loader"
                }
            ]
        },
        resolve: {
            extensions: ['', '.js'],
            root: [
                SRC_TAB,
                SRC_COMMON
            ]
        }
    },

    // Setup / Admin
    {
        entry: {
            lib: path.resolve(SRC_SETUP, "./js/index.js"),
            views: path.resolve(SRC_SETUP, "./js/index.jsx")
        },
        output: {
            filename: 'setup.[name].js',
            path: DIST,
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel'
                },
                {
                    test: /\.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel'
                },
                {
                    test: /\.sass$/,
                    loaders: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    loader: "url-loader"
                }
            ]
        },
        externals: {
            // don't bundle the 'react' npm package with our bundle.js
            // but get it from a global 'React' variable
            // 'react': 'React'
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
            root: [
                path.resolve(SRC_SETUP, "js"),
                path.resolve(SRC_SETUP, "sass"),
                SRC_COMMON
            ]
        }
    },

    // Popup
    {
        entry: {
            lib: path.resolve(SRC_POPUP, "./js/index.js"),
            views: path.resolve(SRC_POPUP, "./js/index.jsx")
        },
        output: {
            filename: 'popup.[name].js',
            path: DIST,
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel'
                },
                {
                    test: /\.jsx$/,
                    exclude: /(node_modules)/,
                    loader: 'babel'
                },
                {
                    test: /\.sass$/,
                    loaders: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    loader: "url-loader"
                }
            ]
        },
        externals: {
            // don't bundle the 'react' npm package with our bundle.js
            // but get it from a global 'React' variable
            // 'react': 'React'
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.sass'],
            root: [
                path.resolve(SRC_POPUP, "js"),
                path.resolve(SRC_POPUP, "sass"),
                SRC_COMMON
            ]
        }
    }

];
