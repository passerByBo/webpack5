const path = require('path');

//提取css到一个文件
const MiniCssExtractPLugin = require('mini-css-extract-plugin');
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.jsx'
    },
    output: {
        filename: '[name]_[chunkhash:8]-bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    watch: true,
    watchOptions:{
        //默认为空，忽略监听的文件夹，可以提升一定性能
        ignored: /node_modules/,
        //判断文件变化是通过不停地询问系统指定文件有没有变化实现的，每秒询问1次
        poll: 1000,
        //监听变化300ms后再去执行
        aggregateTimeout: 300,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,//10kb
                    }
                }
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPLugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPLugin.loader, 'css-loader', 'less-loader']
            },
        ]
    },
    plugins:[
        //给剥离出的css设置contenthash
        new MiniCssExtractPLugin({
            filename: '[name][contenthash:8].css'
        })
    ]
}