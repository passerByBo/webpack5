const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
                    'babel-loader',
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
        ...htmlWebpackPlugins,
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../', 'public/index.ejs')
        })
    ]
}