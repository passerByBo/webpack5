const path = require('path');
const glob = require('glob');
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

//并行压缩插件
const TerserPlugin = require('terser-webpack-plugin')

//擦除无用的css  PurifyCSS遍历代码，识别已经用到的 css class。 
//uncss需要通过 jsdom 加载，所有的样式通过 PostCSS 解析，通过 document.querySelector 识别 html 文件中不存在的选择器。
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

//图片压缩
//无损压缩推荐imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const PATHS = { src: path.resolve('../src') }

module.exports = merge(common, {
    mode: 'production',
    stats: 'verbose',//输出所有信息normal：标准信息；error-only：只有错误的时候才输出信息，命令中传入参数输出stats.json
    output: {
        filename: '[name]_[chunkhash:8].bundle.js',
        path: path.resolve(__dirname, '../', 'dist')
    },
    optimization: {
        minimize: true,

        //'...'可以继承默认的压缩配置
        minimizer: [
            /**压缩css*/
            new CssMinimizerPlugin(),
            //并行压缩
            new TerserPlugin({ parallel: 2 }),
            '...'
        ]
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
        new ImageMinimizerPlugin({
            minimizerOptions: {
              plugins: [['jpegtran', { progressive: true }]],
            },
          }),
        new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
        }),
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        //分包使用CDN替换
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
        //             global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
        //             global: 'ReactDOM',
        //         },
        //     ]
        // })
    ]
})