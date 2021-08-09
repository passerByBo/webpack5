const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'big-number': path.join(__dirname, './src/index.js'),
        'big-number.min': path.join(__dirname, './src/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        //指定库的全局变量名
        library: 'bigNumber',
        //支持库的引入方式
        libraryTarget: 'umd',
        //每次打包清空原文件
        clean: true
    },
    optimization: {
        //minimize: false,
        //webpack5默认使用terser-webpack-plugin插件压缩代码，此处使用它的自定义
        minimizer: [
            //只压缩 .min.js结尾的文件
            new TerserWebpackPlugin({
                test: /\.min\.js$/i
            })
        ]
    }
}