const path = require('path');
//提取CSS文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
//压缩CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//压缩html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//提取公共资源，使用CDN
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name]_[chunkhash:8].bundle.js',
        path: path.resolve(__dirname, '../', 'dist')
    },
    optimization: {
        minimize: true,

        //'...'可以继承默认的压缩配置
        minimizer: [/**压缩css*/new CssMinimizerPlugin(), '...']
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
                            name: 'assets/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [require('autoprefixer')],
                        },
                    },
                },
                // 将px转换成rem进行移动端自适应
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,
                        remPrecision: 8
                    }
                }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
                    global: 'React'
                },
                {
                    module: 'react-dom',
                    entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
                    global: 'ReactDOM',
                },
            ]
        })
    ]
})