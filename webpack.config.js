const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { version } = require("./package.json");

const { NormalModuleReplacementPlugin, DefinePlugin } = webpack;

const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");
const RESOURCES = path.resolve(__dirname, "./resources");
const INDEX_TEMPLATE = path.resolve(RESOURCES, "./template.pug");
const MANIFEST = path.resolve(RESOURCES, "./manifest.json");

const SRC_BACKGROUND = path.resolve(SOURCE, "background");
const SRC_POPUP = path.resolve(SOURCE, "popup");
const SRC_SETUP = path.resolve(SOURCE, "setup");
const SRC_TAB = path.resolve(SOURCE, "tab");
const SRC_DIALOG = path.resolve(SOURCE, "dialog");

const BASE_CONFIG_DEFAULTS = {
    imageLoader: "file-loader"
};

function getBaseConfig({ imageLoader } = BASE_CONFIG_DEFAULTS) {
    const config = {
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ["style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.pug$/,
                    use: "pug-loader"
                }
            ]
        },

        resolve: {
            extensions: [".js", ".jsx", ".json"]
        }
    };
    if (imageLoader === "file-loader") {
        config.module.rules.push({
            test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
            loader: "file-loader",
            options: {
                name: "[path][name].[hash].[ext]"
            }
        });
    } else if (imageLoader === "url-loader") {
        config.module.rules.push({
            test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
            loader: "url-loader"
        });
    }
    return config;
}

function getBasePlugins() {
    if (process.env.NODE_ENV === "production") {
        return [
            new DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }),
            new UglifyJsPlugin({
                test: /\.js($|\?)/i,
                uglifyOptions: {
                    ie8: false,
                    ecma: 7,
                    warnings: false,
                    mangle: false,
                    compress: true,
                    output: {
                        ascii_only: true,
                        beautify: false
                    }
                }
            })
        ];
    }
    return [];
}

const backgroundConfig = Object.assign({}, getBaseConfig(), {
    entry: path.resolve(SRC_BACKGROUND, "./index.js"),

    output: {
        filename: "background.js",
        path: DIST
    },

    plugins: [
        ...getBasePlugins(),
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

const popupConfig = Object.assign({}, getBaseConfig(), {
    entry: path.resolve(SRC_POPUP, "./index.js"),

    output: {
        filename: "popup.js",
        path: DIST
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: "Buttercup",
            template: INDEX_TEMPLATE,
            filename: "popup.html",
            inject: "body"
        })
    ]
});

const setupConfig = Object.assign({}, getBaseConfig(), {
    entry: path.resolve(SRC_SETUP, "./index.js"),

    output: {
        filename: "setup.js",
        path: DIST
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "setup.html",
            inject: "body"
        }),
        new NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop")
    ]
});

const dialogConfig = Object.assign({}, getBaseConfig(), {
    entry: path.resolve(SRC_DIALOG, "./index.js"),

    output: {
        filename: "dialog.js",
        path: DIST
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "dialog.html",
            inject: "body"
        }),
        new NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop")
    ]
});

const tabConfig = Object.assign({}, getBaseConfig({ imageLoader: "url-loader" }), {
    entry: path.resolve(SRC_TAB, "./index.js"),

    output: {
        filename: "tab.js",
        path: DIST
    },

    plugins: [...getBasePlugins()]
});

module.exports = [backgroundConfig, popupConfig, setupConfig, tabConfig, dialogConfig];
