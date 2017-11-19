const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { version } = require("./package.json");

const { NormalModuleReplacementPlugin } = webpack;

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
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            },
            {
                test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[hash].[ext]"
                }
            }
        ]
    },

    resolve: {
        extensions: [".js", ".jsx", ".json"]
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
            title: `Buttercup v${version}`,
            // baseURL: "http://domain/",
            template: INDEX_TEMPLATE,
            // favicon: FAVICON,
            filename: "setup.html",
            inject: "body"
        }),
        new NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop")
    ]
});

const tabConfig = Object.assign({}, baseConfig, {
    entry: path.resolve(SRC_TAB, "./index.js"),

    output: {
        filename: "tab.js",
        path: DIST
    }
});

module.exports = [backgroundConfig, popupConfig, setupConfig, tabConfig];
