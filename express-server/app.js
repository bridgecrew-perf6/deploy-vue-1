const express = require('express')
const history = require('connect-history-api-fallback')

const app = express()

// 注意顺序
app.use(history())
app.use(express.static(__dirname + '/static/dist/'))

app.listen(8086, (err) => {
    if(!err) {
        console.log('服务器启动成功...');
    }
})