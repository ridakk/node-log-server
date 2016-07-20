const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'ui/dist');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
    //Entry points to the project
    entry: [
        'webpack/hot/dev-server',
        'webpack/hot/only-dev-server',
        path.join(__dirname, '/ui/src/app/app.js'),
    ],
    //Config options on how to interpret requires imports
    resolve: {
        extensions: ["", ".js"],
        //node_modules: ["web_modules", "node_modules"]  (Default Settings)
    },
    //Server Configuration options
    devServer: {
        contentBase: 'ui/src/www/dev/', //Relative directory for base of server
        devtool: 'eval',
        hot: true, //Live-reload
        inline: true,
        port: 5000, //Port Number
        host: 'localhost', //Change to '0.0.0.0' for external facing server
    },
    devtool: 'eval',
    output: {
        path: buildPath, //Path of output file
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        //Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        new webpack.NoErrorsPlugin(),
        //Moves files
        new TransferWebpackPlugin([{
            from: 'ui/src/www/dev'
        }])
    ],
    module: {
        loaders: [{
            //React-hot loader and
            test: /\.js$/, //All .js files
            loaders: ['react-hot', 'babel-loader'], //react-hot is like browser sync and babel loads jsx and es6-7
            exclude: [nodeModulesPath],
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }],
    },
    //eslint config options. Part of the eslint-loader package
    eslint: {
        configFile: '.eslintrc',
    },
};

module.exports = config;
