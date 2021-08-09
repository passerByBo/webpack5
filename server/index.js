/**
 * 服务器端渲染
 */

if (typeof self === 'undefined') {
    global.self = {};
}

const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const fs = require('fs');
const App = require('../dist/app-server')//客户端代码
const template = fs.readFileSync(
    path.join(__dirname, '../dist/index.html'),
    'utf-8'
)


const useTemplate = (html) => {
    const data = { name: 'shixiaobo' }
    const str = template
        .replace('<!--HTML_PLACEHOLDER-->', html)
        .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${JSON.stringify(data)}</script>`)
        console.log(str)
    return str;
}

const createServer = (port) => {
    //设置静态目录
    const app = express();
    app.use(express.static('dist'))

    app.get('/app', (req,res) => {
        const html = useTemplate(renderToString(App))

        res.status(200).send(html)
    })

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

createServer(process.env.port || 3033)


