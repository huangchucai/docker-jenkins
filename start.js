const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');

const server = http.createServer((req, res) => {
    let {pathname} = url.parse(req.url);
    let absPath = path.join(__dirname, pathname);
    // 看看是目录还是文件
    fs.stat(absPath, (err, statObj) => {
        if (err) {
            res.statusCode = 404;
            res.end('Not found');
        }
        if (statObj.isFile()) {
            res.setHeader('Content-type', mime.getType(absPath) + ';charset=utf-8');
            fs.createReadStream(absPath).pipe(res);
        } else {
            let realPath = path.join(absPath, 'index.html');
            fs.access(realPath, (err) => {
                if (err) {
                    res.statusCode = 404;
                    res.end('Not found');
                }
                res.setHeader('Content-type', 'text/html;charset=uft-8');
                fs.createReadStream(realPath).pipe(res);
            });
        }

    });

});

server.listen(3000);