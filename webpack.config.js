import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
import webpack from "webpack";
import ResolveTypeScriptPlugin from "resolve-typescript-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { merge } from "webpack-merge";
import PugPlugin from "pug-plugin";
import sass from "sass";

import packageInfo from "./package.json" assert { type: "json" };
import manifestV2 from "./resources/manifest.v2.json" assert { type: "json" };
import manifestV3 from "./resources/manifest.v3.json" assert { type: "json" };

const { BannerPlugin } = webpack;
const { BROWSER } = process.env;
const V3_BROWSERS = ["chrome", "edge"];
const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = path.resolve(__dirname, "dist");
const ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");

if (!BROWSER) {
    throw new Error("BROWSER must be specified");
}

function buildManifest(assetNames, manifest) {
    const newManifest = JSON.parse(JSON.stringify(manifest));
    newManifest.version = packageInfo.version;
    assetNames.forEach((assetFilename) => {
        if (/^[^\/\\]+\.js$/.test(assetFilename)) {
            if (/\bbackground\b/.test(assetFilename) && assetFilename !== "background.js") {
                newManifest.background.scripts.unshift(assetFilename);
            }
            if (/\btab\b/.test(assetFilename) && assetFilename !== "tab.js") {
                newManifest.content_scripts[0].js.unshift(assetFilename);
            }
        }
    });
    writeFileSync(path.join(DIST, "./manifest.json"), JSON.stringify(newManifest, undefined, 2));
}

function getBaseConfig() {
    return {
        devtool: false,

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                compact: true,
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        {
                                            targets: {
                                                chrome: "90",
                                                firefox: "85",
                                                edge: "90"
                                            },
                                            useBuiltIns: false
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            loader: "ts-loader"
                        }
                    ],
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: sass
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["css-loader"]
                },
                {
                    test: /\.(jpg|png|svg|eot|svg|ttf|woff|woff2)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/[name][ext]"
                    }
                },
                {
                    test: /\.pug$/,
                    loader: PugPlugin.loader
                }
            ]
        },

        output: {
            filename: "[name].js",
            path: DIST
        },

        performance: {
            hints: false,
            maxEntrypointSize: 768000,
            maxAssetSize: 768000
        },

        resolve: {
            alias: {
                iocane: "iocane/web",
                "react/jsx-runtime": "react/jsx-runtime.js",
                "react/jsx-dev-runtime": "react/jsx-dev-runtime.js"
            },
            // No .ts/.tsx included due to the typescript resolver plugin
            extensions: [".js", ".jsx"],
            fallback: {
                buffer: false,
                crypto: false,
                fs: false,
                path: false,
                util: false
            },
            plugins: [
                // Handle .ts => .js resolution
                new ResolveTypeScriptPlugin()
            ]
        }
    };
}

export default [
    merge(getBaseConfig(), {
        entry: {
            background: path.resolve(__dirname, "./source/background/index.ts")
        },

        plugins: [
            new BannerPlugin({
                // Fix service worker scope
                banner: `window = self || global;`,
                raw: true
            }),
            {
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
                        buildManifest(
                            Object.keys(compilation.getStats().compilation.assets),
                            V3_BROWSERS.includes(BROWSER) ? manifestV3 : manifestV2
                        );
                    });
                }
            },
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(__dirname, "./resources", "buttercup-*.png"),
                        to: path.join(DIST, "manifest-res"),
                        context: path.join(__dirname, "./resources")
                    },
                    {
                        from: path.join(ICONS_PATH, "/*"),
                        to: path.join(DIST, "scripts/icons"),
                        context: ICONS_PATH
                    }
                ]
            })
        ]
    }),
    merge(getBaseConfig(), {
        entry: {
            tab: path.resolve(__dirname, "./source/tab/index.ts")
        },

        output: {
            publicPath: "/"
        }
    }),
    merge(getBaseConfig(), {
        devtool: false,

        entry: {
            full: path.resolve(__dirname, "./source/full/index.pug"),
            popup: path.resolve(__dirname, "./source/popup/index.pug")
        },

        output: {
            chunkLoadingGlobal: "__bcupjsonp",
            filename: "[name].js",
            path: DIST,
            publicPath: "/"
        },

        plugins: [
            new PugPlugin({
                css: {
                    filename: "styles/[name].css",
                    chunkFilename: "styles/[name].[contenthash:8].css"
                },
                filename: "[name].html",
                js: {
                    filename: "scripts/[name].js",
                    chunkFilename: "scripts/[name].[contenthash:8].js"
                },
                pretty: false
            })
        ]
    })
];
