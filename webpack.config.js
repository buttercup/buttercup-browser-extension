const path = require("path");
const fs = require("fs");
const { DefinePlugin, NormalModuleReplacementPlugin } = require("webpack");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { version } = require("./package.json");
const manifest = require("./resources/manifest.json");

const CHANGELOG = path.resolve(__dirname, "./CHANGELOG.md");
const DIST = path.resolve(__dirname, "./dist");
const ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");
const INDEX_TEMPLATE = path.resolve(__dirname, "./resources/template.pug");
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

function getBaseConfig() {
    return {
        devtool: false,

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

        output: {
            filename: "[name].js",
            path: DIST,
            publicPath: ""
        },

        plugins: [
            new MiniCSSExtractPlugin(),
            new DefinePlugin(__configDefines),
            new DefinePlugin({
                __VERSION__: JSON.stringify(version)
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
}

module.exports = [
    merge(getBaseConfig(), {
        entry: {
            background: path.join(SOURCE, "./background/index.js")
        },

        optimization: {
            splitChunks: {
                automaticNameDelimiter: "-",
                cacheGroups: {
                    vendors: {
                        test: /\/node_modules\//,
                        name: "background-vendors",
                        priority: -10,
                        chunks: "initial"
                    }
                }
            }
        }
    }),
    merge(getBaseConfig(), {
        entry: {
            tab: path.join(SOURCE, "./tab/index.js")
        }
    }),
    merge(getBaseConfig(), {
        entry: {
            dialog: path.join(SOURCE, "./dialog/index.js"),
            popup: path.join(SOURCE, "./popup/index.js"),
            setup: path.join(SOURCE, "./setup/index.js")
        },

        optimization: {
            splitChunks: {
                automaticNameDelimiter: "-",
                cacheGroups: {
                    vendors: {
                        test: /\/node_modules\//,
                        name: "vendors",
                        priority: -10,
                        chunks: "initial"
                    },
                    default: {
                        priority: -20,
                        chunks: "initial",
                        reuseExistingChunk: true,
                        name: "common"
                    }
                }
            }
        },

        plugins: [
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
            })
        ]
    })
];
