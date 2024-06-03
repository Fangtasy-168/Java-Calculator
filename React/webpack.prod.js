const common = require("./webpack.common.js")
const { merge } = require('webpack-merge')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
            // minify: {
            //     removeAttributeQuotes: true,
            //     collapseWhitespace: true,
            //     removeComments: true,
            // }
        })
    ],
});