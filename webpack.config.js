const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { devDependencies, version } = require("./package.json");

const { NormalModuleReplacementPlugin, DefinePlugin, IgnorePlugin } = webpack;

const configDefines = Object.keys(process.env).reduce((output, key) => {
    if (/^_.+_$/.test(key)) {
        output[key] = JSON.stringify(process.env[key]);
    }
    return output;
}, {});

const BUTTERCUP_ENTRY = process.env._BUTTERCUP_WEB_IMPORT_;
const DIST = path.resolve(__dirname, "./dist");
const SOURCE = path.resolve(__dirname, "./source");
const RESOURCES = path.resolve(__dirname, "./resources");
const INDEX_TEMPLATE = path.resolve(RESOURCES, "./template.pug");
const MANIFEST = path.resolve(RESOURCES, "./manifest.json");
const CHANGELOG = path.resolve(__dirname, "./CHANGELOG.md");
const ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");

const SRC_BACKGROUND = path.resolve(SOURCE, "background");
const SRC_POPUP = path.resolve(SOURCE, "popup");
const SRC_SETUP = path.resolve(SOURCE, "setup");
const SRC_TAB = path.resolve(SOURCE, "tab");
const SRC_DIALOG = path.resolve(SOURCE, "dialog");

const BASE_CONFIG_DEFAULTS = {
    addFileHash: true,
    imageLoader: "file-loader",
};
const REACT_PACKAGES = Object.keys(devDependencies).filter((name) => /^react(-|$)/.test(name));
const REDUX_PACKAGES = Object.keys(devDependencies).filter((name) => /^redux(-|$)/.test(name));

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getBaseConfig({ addFileHash, imageLoader } = BASE_CONFIG_DEFAULTS) {
    const config = {
        devtool: "none",

        mode: process.env.NODE_ENV || "development",

        optimization: {
            minimize: IS_PRODUCTION,
            minimizer: [new TerserPlugin()],
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [SOURCE, require.resolve(BUTTERCUP_ENTRY)],
                    use: "babel-loader",
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.pug$/,
                    use: "pug-loader",
                },
            ],
        },

        node: {
            child_process: "empty",
            dns: "empty",
            net: "empty",
            tls: "empty",
        },

        resolve: {
            extensions: [".js", ".jsx", ".json"],
        },
    };
    if (imageLoader === "file-loader") {
        config.module.rules.push({
            test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
            loader: "file-loader",
            options: {
                name: addFileHash ? "[path][name].[hash].[ext]" : "[path][name].[ext]",
            },
        });
    } else if (imageLoader === "url-loader") {
        config.module.rules.push({
            test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
            loader: "url-loader",
        });
    }
    return config;
}

function getBasePlugins() {
    const common = [
        new DefinePlugin(configDefines),
        new DefinePlugin({
            __VERSION__: JSON.stringify(version),
        }),
        new NormalModuleReplacementPlugin(/^fs$/, path.join(SOURCE, "fsMock.js")),
        new NormalModuleReplacementPlugin(/\/iconv-loader/, "node-noop"),
    ];
    if (process.env.NODE_ENV === "production") {
        return [
            ...common,
            new DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            }),
        ];
    }
    return [...common];
}

const backgroundConfig = Object.assign({}, getBaseConfig(), {
    entry: {
        index: path.resolve(SRC_BACKGROUND, "./index.js"),
        vendor: [...REDUX_PACKAGES],
        buttercup: ["@buttercup/ui", "@buttercup/channel-queue", "@buttercup/iconographer"],
        google: ["@buttercup/google-oauth2-client"],
    },

    output: {
        filename: "background-[name].js",
        path: DIST,
    },

    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== "google" && chunk.name !== "index";
            },
            minChunks: Infinity,
        },
    },

    plugins: [
        ...getBasePlugins(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: MANIFEST,
                    transform: (contents) => {
                        const manifest = JSON.parse(contents.toString());
                        manifest.version = version;
                        return JSON.stringify(manifest, undefined, 4);
                    },
                },
                {
                    from: path.join(RESOURCES, "buttercup-*.png"),
                },
                {
                    from: CHANGELOG,
                },
                {
                    from: ICONS_PATH,
                    to: "icons",
                },
            ],
        }),
    ],
});

const popupConfig = Object.assign({}, getBaseConfig(), {
    entry: {
        index: path.resolve(SRC_POPUP, "./index.js"),
        vendor: [...REACT_PACKAGES, ...REDUX_PACKAGES],
        buttercup: ["@buttercup/ui", "@buttercup/channel-queue", "@buttercup/iconographer"],
    },

    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== "index";
            },
            minChunks: Infinity,
        },
    },

    output: {
        filename: "popup-[name].js",
        path: DIST,
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: "Buttercup",
            template: INDEX_TEMPLATE,
            filename: "popup.html",
            inject: "body",
        }),
    ],
});

const setupConfig = Object.assign({}, getBaseConfig(), {
    entry: {
        index: path.resolve(SRC_SETUP, "./index.js"),
        vendor: [...REACT_PACKAGES, ...REDUX_PACKAGES, "dropbox"],
        buttercup: ["@buttercup/ui", "@buttercup/channel-queue", "@buttercup/dropbox-client"],
    },

    output: {
        filename: "setup-[name].js",
        path: DIST,
    },

    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== "index";
            },
            minChunks: Infinity,
        },
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "setup.html",
            inject: "body",
        }),
    ],
});

const dialogConfig = Object.assign({}, getBaseConfig(), {
    entry: {
        index: path.resolve(SRC_DIALOG, "./index.js"),
        vendor: [...REACT_PACKAGES, ...REDUX_PACKAGES],
        buttercup: ["@buttercup/ui", "@buttercup/channel-queue", "@buttercup/iconographer"],
    },

    output: {
        filename: "dialog-[name].js",
        path: DIST,
    },

    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== "index";
            },
            minChunks: Infinity,
        },
    },

    plugins: [
        ...getBasePlugins(),
        new HtmlWebpackPlugin({
            title: `Buttercup v${version}`,
            template: INDEX_TEMPLATE,
            filename: "dialog.html",
            inject: "body",
        }),
    ],
});

const tabConfig = Object.assign({}, getBaseConfig({ addFileHash: false, imageLoader: "file-loader" }), {
    entry: path.resolve(SRC_TAB, "./index.js"),

    output: {
        filename: "tab.js",
        path: DIST,
    },

    plugins: [...getBasePlugins()],
});

module.exports = [backgroundConfig, popupConfig, setupConfig, tabConfig, dialogConfig];
