const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
var ICON = path.join(__dirname, 'icon.png');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


//设置多页打包，思路是使用glob解析出对应的入口文件，然后设置对应的entry和HtmlWebpackPlugin
function setMap() {
    const entry = {};
    const htmlWebpackPlugins = [];

    const pagePaths = glob.sync(path.join(__dirname, '../src/,pa/**/index.js'));
    pagePaths.forEach((pagePath) => {
        const name = pagePath.match(/src\/map\/(.*)\/index\.js/)[1];

        entry[name] = pagePath;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                filename: `${name}.html`,
                chunks: [name],
                template: path.join(__dirname, '../', `src/mpa/${name}/index.html`)
            })
        )
        return name;
    })
    return {
        entry,
        htmlWebpackPlugins,
    };
}

const { entry, htmlWebpackPlugins } = setMap();


module.exports = {
    //打包时间优化（效果明显）
    cache: {
        type: 'filesystem',//memory基于内存的临时缓存
        //cacheDirectory: path.resolve(__dirname, '.temp_cache')
    },
    //resolve减少打包时间，缩小构建目标
    // resolve: {
    //     //合理使用 alias，引用三方依赖的生成版本。
    //     alias: {
    //         react: path.resolve(__dirname, './node_modules/react/dist/react.min.js')
    //     },
    //     //resolve.modules 减少模块搜索层级，指定当前 node_modules。
    //     modules: [path.resolve(__dirname, './node_modules')],
    //     //resolve.extension 对于没有指定后缀的引用，指定解析的文件后缀算法。
    //     extensions: ['.js', '.jsx', '.json'],
    //     //resovle.mainFields 指定入口文件
    //     mainFields: ['main']
    // },
    entry: {
        ...entry,
        main: path.join(__dirname, '../src/index.jsx'),
        //worker
        //worker: './src/worker.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../', 'dist'),
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    //并行多线程打包
                    {
                        loader: 'thread-loader',
                        options: {
                            workder: 3,
                        }
                    },
                    'babel-loader',
                    //会报错提示找不上.eslintrc
                    // 'eslint-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [require('autoprefixer')],
                        },
                    },
                },
                ]
            },
        ]
    },
    plugins: [
        //基础库分离,基础包和业务基础包打包成一个文件，可以提供给其它项目使用
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../build/library/library.json'),
            scope: 'xyz',
            sourceType: 'commonjs2',
        }),
        //优化提示
        new FriendlyErrorsWebpackPlugin({
            onErrors: (severity, errors) => {
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                notifier.notify({
                    title: "Webpack error",
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                    icon: ICON
                });
            }
        }),
        //主动捕获并处理构建错误,compiler 在每次构建结束后会触发 done 这个 hook,process.exit 主动处理构建报错也可以console提示
        // function () {
        //     //this指向compiler
        //     this.hooks.done.tap('done', (stats) => {
        //         if (
        //             stats.compilation.errors &&
        //             stats.compilation.errors.length &&
        //             process.argv.indexOf('--watch') === -1
        //         ) {
        //             process.exit(1); // 抛出异常，终端就知道构建失败了
        //         }
        //     })
        // },
        ...htmlWebpackPlugins,
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../', 'public/index.ejs')
        }),
        //包体积分析
        // new BundleAnalyzerPlugin()
    ]
}