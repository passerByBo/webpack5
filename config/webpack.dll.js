/**
 * 将基础库预编译
 * 可提升打包速度
 * 不会将包从主代码中剥离
 */
const path = require('path');
const ptah = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry:{
        library: ['react', 'react-dom']
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.resolve(__dirname, '../build/library'),
        library: 'name'
    },
    plugins:[
        new webpack.DllPlugin({
            context: __dirname,
            name: '[name]_[hash]',
            path: path.join(__dirname, '../build/library/[name].json')
        })
    ]
}