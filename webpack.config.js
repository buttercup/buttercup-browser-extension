const path = require("path");
const fs = require("fs");
const { DefinePlugin, NormalModuleReplacementPlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { devDependencies, version } = require("./package.json");
const manifest = require("./resources/manifest.json");

const CHANGELOG = path.resolve(__dirname, "./CHANGELOG.md");
const DIST = path.resolve(__dirname, "./dist");
const ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");
const INDEX_TEMPLATE = path.resolve(__dirname, "./resources/template.pug");
const REACT_PACKAGES = Object.keys(devDependencies).filter(name => /^react(-|$)/.test(name));
const REDUX_PACKAGES = Object.keys(devDependencies).filter(name => /^redux(-|$)/.test(name));
const SOURCE = path.resolve(__dirname, "./source");

const __configDefines = Object.keys(process.env).reduce((output, key) => {
    if (/^_.+_$/.test(key)) {
        output[key] = JSON.stringify(process.env[key]);
    }
    return output;
}, {});

function buildManifest(assetNames) {
    const newManifest = JSON.parse(JSON.stringify(manifest));
    newManifest.version = version;
    assetNames.forEach(assetFilename => {
        // console.log("ASSET NAME", assetFilename);
        if (/^[^\/\\]+\.js$/.test(assetFilename)) {
            // if (/\.js$/.test(assetFilename) && /^vendors-/.test(assetFilename)) {
            if (/\bbackground\b/.test(assetFilename) && assetFilename !== "background.js") {
                newManifest.background.scripts.unshift(assetFilename);
            }
            if (/\btab\b/.test(assetFilename) && assetFilename !== "tab.js") {
                newManifest.content_scripts[0].js.unshift(assetFilename);
            }
        }
    });
    fs.writeFileSync(path.join(DIST, "./manifest.json"), JSON.stringify(newManifest, undefined, 2));
}

module.exports = {
    devtool: false,

    entry: {
        background: path.join(SOURCE, "./background/index.js"),
        dialog: path.join(SOURCE, "./dialog/index.js"),
        popup: path.join(SOURCE, "./popup/index.js"),
        setup: path.join(SOURCE, "./setup/index.js"),
        tab: path.join(SOURCE, "./tab/index.js")
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: [MiniCSSExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            },
            {
                test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]"
                }
            }
        ]
    },

    // optimization: {
    //     splitChunks: {
    //         automaticNameDelimiter: "-",
    //         cacheGroups: {
    //             vendors: {
    //                 test: /\/node_modules\//,
    //                 name: "vendors",
    //                 priority: -10,
    //                 chunks: "initial"
    //             },
    //             default: {
    //                 priority: -20,
    //                 chunks: "initial",
    //                 reuseExistingChunk: true,
    //                 name: "common"
    //             }
    //         }
    //     }
    // },

    output: {
        filename: "[name].js",
        path: DIST,
        publicPath: ""
    },

    plugins: [
        new MiniCSSExtractPlugin(),
        {
            apply: compiler => {
                compiler.hooks.afterEmit.tap("AfterEmitPlugin", compilation => {
                    buildManifest(Object.keys(compilation.getStats().compilation.assets));
                });
            }
        },
        new CopyWebpackPlugin({
            patterns: [
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
            ]
        }),
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
    ],

    resolve: {
        fallback: {
            Buffer: false,
            child_process: false,
            dns: false,
            net: false,
            process: false,
            stream: false,
            tls: false,
            util: false
        }
    },

    watchOptions: {
        ignored: /node_modules/,
        poll: 1000
    }
};
