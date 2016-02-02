(function(module) {

    "use strict";

    let output = __dirname + "/../../dist",
        jsxDir = __dirname + "/jsx";

    module.exports = {
        entry: `${jsxDir}/index.jsx`,
        output: {
            filename: 'app.js',
            path: `${output}/popup/`,
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
        module: {
            loaders: [
                {
                    //tell webpack to use jsx-loader for all *.jsx files
                    test: /\.jsx$/,
                    loader: 'jsx-loader?insertPragma=React.DOM&harmony'
                }
            ]
        },
        externals: {
            //don't bundle the 'react' npm package with our bundle.js
            //but get it from a global 'React' variable
            'react': 'React'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    };

})(module);
