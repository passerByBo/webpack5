const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool:'source-map',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        historyApiFallback: true,
        hot: true,
        quiet: true,
        port: 8082,
    },
    module: {
        rules: [
            //将lib-flexible资源进行内联
            {
                resourceQuery: /raw/,
                type: 'asset/source'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name][hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

        ]
    }
})