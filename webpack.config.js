const path = require("path");
const webpack = require("webpack");

const BUILD = path.resolve(__dirname, "./build");
const SOURCE = path.resolve(__dirname, "./source");
const NODE_MODULES = path.resolve(__dirname, "./node_modules");

const SRC_BACKGROUND = path.resolve(SOURCE, "background");
const SRC_POPUP = path.resolve(SOURCE, "popup");
const SRC_SETUP = path.resolve(SOURCE, "setup");
const SRC_TAB = path.resolve(SOURCE, "tab");
const SRC_COMMON = path.resolve(SOURCE, "common");

const imageWebpackLoaderQuery = {
    progressive: true,
    optimizationLevel: 7,
    interlaced: false,
    pngquant: {
        quality: '65-90',
        speed: 4
    }
};

const additionalPlugins = process.env.NODE_ENV === "production" ?
    [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        })
    ] : [];

module.exports = [

    // Background
    {
        entry: path.resolve(SRC_BACKGROUND, "index.js"),
        output: {
            filename: "background.js",
            path: BUILD
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                }
            ]
        },
        plugins: [
            ...additionalPlugins
        ],
        resolve: {
            extensions: [".js"],
            modules: [
                SRC_BACKGROUND,
                NODE_MODULES
            ]
        }
    },

    // Tab
    {
        entry: path.resolve(SRC_TAB, "index.js"),
        output: {
            filename: "tab.js",
            path: BUILD
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.png$/i,
                    use: [
                        { loader: "url-loader" },
                        {
                            loader: "image-webpack-loader",
                            query: imageWebpackLoaderQuery
                        }
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    use: [
                        { loader: "url-loader" }
                    ]
                }
            ]
        },
        plugins: [
            ...additionalPlugins
        ],
        resolve: {
            extensions: [".js"],
            modules: [
                SRC_TAB,
                SRC_COMMON,
                NODE_MODULES
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
            path: BUILD,
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(NODE_MODULES, "./any-fs")
                    ],
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.jsx$/,
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.json$/i,
                    use: [
                        { loader: "json-loader" }
                    ]
                },
                {
                    test: /\.sass$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" },
                        { loader: "sass-loader" }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    use: [
                        { loader: "url-loader" }
                    ]
                },
                {
                    test: /\.png$/i,
                    use: [
                        { loader: "url-loader" },
                        {
                            loader: "image-webpack-loader",
                            query: imageWebpackLoaderQuery
                        }
                    ]
                }
            ]
        },
        node: {
            fs: "empty"
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop"),
            ...additionalPlugins
        ],
        resolve: {
            extensions: [".js", ".jsx"],
            modules: [
                path.resolve(SRC_SETUP, "js"),
                path.resolve(SRC_SETUP, "sass"),
                SRC_COMMON,
                NODE_MODULES
            ]
        },
        resolveLoader: {
            modules: [
                NODE_MODULES
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
            path: BUILD,
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.jsx$/,
                    exclude: [
                        NODE_MODULES
                    ],
                    use: [
                        { loader: "babel-loader" }
                    ]
                },
                {
                    test: /\.sass$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" },
                        { loader: "sass-loader" }
                    ]
                },
                {
                    test: /\.[ot]tf$/,
                    use: [
                        { loader: "url-loader" }
                    ]
                }
            ]
        },
        plugins: [
            ...additionalPlugins
        ],
        resolve: {
            extensions: [".js", ".jsx", ".sass"],
            modules: [
                path.resolve(SRC_POPUP, "js"),
                path.resolve(SRC_POPUP, "sass"),
                SRC_COMMON,
                NODE_MODULES
            ]
        }
    }

];
