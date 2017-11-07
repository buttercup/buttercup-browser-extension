const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { version } = require("./package.json");

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");
const RESOURCES = path.resolve(__dirname, "./resources");
const INDEX_TEMPLATE = path.resolve(RESOURCES, "./template.pug");
const MANIFEST = path.resolve(RESOURCES, "./manifest.json");

const SRC_BACKGROUND = path.resolve(SOURCE, "background");
const SRC_POPUP = path.resolve(SOURCE, "popup");
const SRC_SETUP = path.resolve(SOURCE, "setup");
const SRC_TAB = path.resolve(SOURCE, "tab");

const baseConfig = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            },
            {
                test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[hash].[ext]",
                },
            }
        ]
    },

    resolve: {
        extensions: [ ".js", ".jsx", ".json" ]
    }
};

const backgroundConfig = Object.assign({}, baseConfig, {
    entry: path.resolve(SRC_BACKGROUND, "./index.js"),

    output: {
        filename: "background.js",
        path: DIST
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: MANIFEST,
                transform: contents => {
                    const manifest = JSON.parse(contents.toString());
                    manifest.version = version;
                    return JSON.stringify(manifest, undefined, 4);
                }
            },
            {
                from: path.join(RESOURCES, "buttercup-*.png")
            }
        ])
    ]
});

const popupConfig = Object.assign({}, baseConfig, {
    entry: path.resolve(SRC_POPUP, "./index.js"),

    output: {
        filename: "popup.js",
        path: DIST
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Buttercup",
            // baseURL: "http://domain/",
            template: INDEX_TEMPLATE,
            // favicon: FAVICON,
            filename: "popup.html",
            inject: "body"
        })
    ]
});

const setupConfig = Object.assign({}, baseConfig, {
    entry: path.resolve(SRC_SETUP, "./index.js"),

    output: {
        filename: "setup.js",
        path: DIST
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: `Buttercup for Browsers v${version}`,
            // baseURL: "http://domain/",
            template: INDEX_TEMPLATE,
            // favicon: FAVICON,
            filename: "setup.html",
            inject: "body"
        })
    ]
});

const tabConfig = Object.assign({}, baseConfig, {
    entry: path.resolve(SRC_TAB, "./index.js"),

    output: {
        filename: "tab.js",
        path: DIST
    }
});

module.exports = [
    backgroundConfig,
    popupConfig,
    setupConfig,
    tabConfig
];


// const BUILD = path.resolve(__dirname, "./build");
// const SOURCE = path.resolve(__dirname, "./source");
// const NODE_MODULES = path.resolve(__dirname, "./node_modules");

// const SRC_BACKGROUND = path.resolve(SOURCE, "background");
// const SRC_POPUP = path.resolve(SOURCE, "popup");
// const SRC_SETUP = path.resolve(SOURCE, "setup");
// const SRC_TAB = path.resolve(SOURCE, "tab");
// const SRC_COMMON = path.resolve(SOURCE, "common");

// const LOADER_IMAGE = {
//     loader: "image-webpack-loader",
//     query: {
//         mozjpeg: {
//             progressive: true
//         },
//         gifsicle: {
//             interlaced: false
//         },
//         optipng: {
//             optimizationLevel: 7
//         },
//         pngquant: {
//             quality: "75-90",
//             speed: 4
//         }
//     }
// };

// const additionalPlugins = process.env.NODE_ENV === "production" ? [
//     new webpack.optimize.UglifyJsPlugin({
//         compress: {
//             warnings: false
//         }
//     }),
//     new webpack.DefinePlugin({
//         "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
//     })
// ] : [];

// module.exports = [

//     // Background
//     {
//         entry: path.resolve(SRC_BACKGROUND, "index.js"),
//         output: {
//             filename: "background.js",
//             path: BUILD
//         },
//         module: {
//             rules: [
//                 {
//                     test: /\.js$/,
//                     exclude: [
//                         NODE_MODULES
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 }
//             ]
//         },
//         plugins: [
//             ...additionalPlugins
//         ],
//         resolve: {
//             extensions: [".js"],
//             modules: [
//                 SRC_BACKGROUND,
//                 NODE_MODULES
//             ]
//         }
//     },

//     // Tab
//     {
//         entry: path.resolve(SRC_TAB, "index.js"),
//         output: {
//             filename: "tab.js",
//             path: BUILD
//         },
//         module: {
//             rules: [
//                 {
//                     test: /\.js$/,
//                     exclude: [
//                         NODE_MODULES
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.png$/i,
//                     use: [
//                         { loader: "url-loader" },
//                         LOADER_IMAGE
//                     ]
//                 },
//                 {
//                     test: /\.[ot]tf$/,
//                     use: [
//                         { loader: "url-loader" }
//                     ]
//                 }
//             ]
//         },
//         plugins: [
//             ...additionalPlugins
//         ],
//         resolve: {
//             extensions: [".js"],
//             modules: [
//                 SRC_TAB,
//                 SRC_COMMON,
//                 NODE_MODULES
//             ]
//         }
//     },

//     // Setup / Admin
//     {
//         entry: {
//             lib: path.resolve(SRC_SETUP, "./js/index.js"),
//             views: path.resolve(SRC_SETUP, "./js/index.jsx")
//         },
//         output: {
//             filename: "setup.[name].js",
//             path: BUILD,
//             // make sure port 8090 is used when launching webpack-dev-server
//             publicPath: "http://localhost:8090/assets"
//         },
//         module: {
//             rules: [
//                 {
//                     test: /\.js$/,
//                     include: [
//                         SRC_SETUP,
//                         SRC_COMMON,
//                         path.resolve(NODE_MODULES, "./any-fs"),
//                         path.resolve(NODE_MODULES, "./webdav-fs"),
//                         path.resolve(NODE_MODULES, "./dropbox-fs")
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.jsx$/,
//                     exclude: [
//                         NODE_MODULES
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.json$/i,
//                     use: [
//                         { loader: "json-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.sass$/,
//                     use: [
//                         { loader: "style-loader" },
//                         { loader: "css-loader" },
//                         { loader: "sass-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.css$/,
//                     use: [
//                         { loader: "style-loader" },
//                         { loader: "css-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.[ot]tf$/,
//                     use: [
//                         { loader: "url-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.png$/i,
//                     use: [
//                         { loader: "url-loader" },
//                         LOADER_IMAGE
//                     ]
//                 }
//             ]
//         },
//         node: {
//             fs: "empty"
//         },
//         plugins: [
//             new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop"),
//             ...additionalPlugins
//         ],
//         resolve: {
//             extensions: [".js", ".jsx"],
//             modules: [
//                 path.resolve(SRC_SETUP, "js"),
//                 path.resolve(SRC_SETUP, "sass"),
//                 SRC_COMMON,
//                 NODE_MODULES
//             ]
//         },
//         resolveLoader: {
//             modules: [
//                 NODE_MODULES
//             ]
//         }
//     },

//     // Popup
//     {
//         entry: {
//             lib: path.resolve(SRC_POPUP, "./js/index.js"),
//             views: path.resolve(SRC_POPUP, "./js/index.jsx")
//         },
//         output: {
//             filename: "popup.[name].js",
//             path: BUILD,
//             // make sure port 8090 is used when launching webpack-dev-server
//             publicPath: "http://localhost:8090/assets"
//         },
//         module: {
//             loaders: [
//                 {
//                     test: /\.js$/,
//                     exclude: [
//                         NODE_MODULES
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.jsx$/,
//                     exclude: [
//                         NODE_MODULES
//                     ],
//                     use: [
//                         { loader: "babel-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.sass$/,
//                     use: [
//                         { loader: "style-loader" },
//                         { loader: "css-loader" },
//                         { loader: "sass-loader" }
//                     ]
//                 },
//                 {
//                     test: /\.[ot]tf$/,
//                     use: [
//                         { loader: "url-loader" }
//                     ]
//                 }
//             ]
//         },
//         plugins: [
//             ...additionalPlugins
//         ],
//         resolve: {
//             extensions: [".js", ".jsx", ".sass"],
//             modules: [
//                 path.resolve(SRC_POPUP, "js"),
//                 path.resolve(SRC_POPUP, "sass"),
//                 SRC_COMMON,
//                 NODE_MODULES
//             ]
//         }
//     }

// ];
