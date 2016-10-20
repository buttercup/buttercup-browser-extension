const path = require("path");

const SOURCE = path.resolve(__dirname, "./source");

module.exports = [

    // Background
    {
        entry: path.resolve(SOURCE, "./background/index.js"),
        output: {
            filename: "background.js",
            path: path.resolve(__dirname, "./dist")
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    include: /buttercup-web/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        resolve: {
            extensions: ['', '.js'],
            alias: {
                __buttercup_web: path.resolve(__dirname, './node_modules/buttercup-web')
            },
            fallback: [path.join(__dirname, 'node_modules')]
        }
    },

    // Setup / Admin
    {
        entry: {
            lib: path.resolve(SOURCE, "./setup/js/index.js"),
            views: path.resolve(SOURCE, "./setup/js/index.jsx")
        },
        output: {
            filename: 'setup.[name].js',
            path: path.resolve(__dirname, "./dist/"),
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    }
                },
                {
                    test: /\.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['react', 'es2015']
                    }
                }
            ]
        },
        externals: {
            // don't bundle the 'react' npm package with our bundle.js
            // but get it from a global 'React' variable
            'react': 'React'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    }

];
