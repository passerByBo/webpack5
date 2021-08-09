const path = require('path');
//提取CSS文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');
//压缩CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: path.join(__dirname, '../src/app.jsx')
    },
    output: {
        filename: '[name]-server.js',
        path: path.resolve(__dirname, '../', 'dist'),
        clean: true,
        // globalObject: 'this',
        library: {
            type: 'umd'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            //将lib-flexible资源进行内联
            {
                resourceQuery: /raw/,
                type: 'asset/source'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 10kb
                    },
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader',
                {
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
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader',
                {
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
            filename: '[name]_[contenthash:8].css',
        }),
        new HtmlWebpackPlugin({
            chunks: ['vendors'],
            minify: false,
            template: path.join(__dirname, '../', 'public/index.ejs')
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        //分包
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    }
}


