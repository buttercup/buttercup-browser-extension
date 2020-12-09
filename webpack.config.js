const path = require("path");
const fs = require("fs");
const { DefinePlugin, NormalModuleReplacementPlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
        if (/\.js$/.test(assetFilename) && /^vendors-/.test(assetFilename)) {
            if (/\bbackground\b/.test(assetFilename)) {
                newManifest.background.scripts.unshift(assetFilename);
            }
            if (/\btab\b/.test(assetFilename)) {
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

    node: {
        Buffer: false,
        child_process: "empty",
        dns: "empty",
        net: "empty",
        stream: "empty",
        tls: "empty"
    },

    optimization: {
        splitChunks: {
            automaticNameDelimiter: "-",
            chunks: "all",
            maxSize: 0,
            minSize: 30000
        }
    },

    output: {
        filename: "[name].js",
        path: DIST
    },

    plugins: [
        {
            apply: compiler => {
                compiler.hooks.afterEmit.tap("AfterEmitPlugin", compilation => {
                    buildManifest(Object.keys(compilation.getStats().compilation.assets));
                });
            }
        },
        new CopyWebpackPlugin([
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
    ],

    watchOptions: {
        ignored: /node_modules/,
        poll: 1000
    }
};
