const path = require("path");
const { DefinePlugin, NormalModuleReplacementPlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { devDependencies, version } = require("./package.json");

const CHANGELOG = path.resolve(__dirname, "./CHANGELOG.md");
const DIST = path.resolve(__dirname, "./dist");
const ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");
const INDEX_TEMPLATE = path.resolve(__dirname, "./resources/template.pug");
const MANIFEST = path.resolve(__dirname, "./resources/manifest.json");
const REACT_PACKAGES = Object.keys(devDependencies).filter(name => /^react(-|$)/.test(name));
const REDUX_PACKAGES = Object.keys(devDependencies).filter(name => /^redux(-|$)/.test(name));
const SOURCE = path.resolve(__dirname, "./source");

const __configDefines = Object.keys(process.env).reduce((output, key) => {
    if (/^_.+_$/.test(key)) {
        output[key] = JSON.stringify(process.env[key]);
    }
    return output;
}, {});

module.exports = {
    devtool: false,

    entry: {
        background: path.join(SOURCE, "./background/index.js"),
        dialog: path.join(SOURCE, "./dialog/index.js"),
        popup: path.join(SOURCE, "./popup/index.js"),
        setup: path.join(SOURCE, "./setup/index.js"),
        tab: path.join(SOURCE, "./tab/index.js")
        // vendor:
        // react: [...REACT_PACKAGES, ...REDUX_PACKAGES],
        // blueprint: ["@blueprintjs/core", "@blueprintjs/icons"],
        // core: ["buttercup/web"],
        // buttercup: ["@buttercup/ui", "@buttercup/channel-queue", "@buttercup/locust", "@buttercup/config"],
        // connection: ["@buttercup/dropbox-client", "@buttercup/google-oauth2-client", "@buttercup/googledrive-client", "dropbox"]
    },

    module: {
        rules: [
            {
                test: /\.js$/,
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
                    // name: "[path][name].[ext]"
                }
            }
        ]
    },

    node: {
        // global: false,
        Buffer: false,
        child_process: "empty",
        dns: "empty",
        net: "empty",
        stream: "empty",
        tls: "empty"
    },

    // optimization: {
    //     splitChunks: {
    //         chunks: "all",
    //         maxSize: 0
    //     }
    // },

    output: {
        filename: "[name].js",
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
                from: CHANGELOG
            },
            {
                from: path.join(__dirname, "./resources", "buttercup-*.png")
            },
            {
                from: ICONS_PATH,
                to: "icons"
            }
        ]),
        new DefinePlugin(__configDefines),
        new DefinePlugin({
            __VERSION__: JSON.stringify(version)
        }),
        new HtmlWebpackPlugin({
            title: "Buttercup",
            template: INDEX_TEMPLATE,
            filename: "popup.html",
            inject: "body",
            chunks: ["popup"]
        }),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "setup.html",
            inject: "body",
            chunks: ["setup"]
        }),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "dialog.html",
            inject: "body",
            chunks: ["dialog"]
        }),
        new NormalModuleReplacementPlugin(/\/iconv-loader/, "node-noop"),
        new NormalModuleReplacementPlugin(/random-number-generator|safe-buffer/, "node-noop")
    ]
};
