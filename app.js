const chokidar = require("chokidar");
const path = require("path");
const http = require("http");
const fs = require("fs");
const url = require("url");
const mime = require("mime");
const port = 3000;
//设置默认文件
let defaultFile = path.join("web/default.html");
//创建server
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  html = fs.readFileSync(defaultFile, "utf-8");
  let urlObj = url.parse(req.url);
  let urlPathname = urlObj.pathname;
  //返回html
  if (urlPathname === "/") {
    let newhtml = handleHtml(html);
    res.end(newhtml);
  } else {
    let filePathname = path.join(__dirname, "/web", urlPathname);
    readStaticFile(res, filePathname);
  }
});

//启动服务
server.listen(port, "127.0.0.1", () => {
  console.log(`服务器运行在 http://:${port}/`);
});
//启动socket
const io = require("socket.io")(server);
io.on("connection", (client) => {
  console.log("a user connected");
  // socket.on("chat message", (msg) => {
  //   io.emit("chat message", msg);
  // });
  client.on("disconnect", () => {
    console.log("disconnect");
  });
});

let dir = path.join(__dirname, "web");

//启动文件监听
var watcher = chokidar.watch(dir, {
  //忽略文件
  ignored: /(^|[\/\\])\../,
  // ignored: [/^[^\s()<>]+\.(json|svg|js|md)$|node_modules$|(^|[\/\\])\../],
  persistent: true,
});

const log = console.log.bind(console);
//监听回调
watcher
  .on("add", (path) => {
    log(`File ${path} has been added`);
  })
  .on("change", (path) => {
    log(`File ${path} has been changed`);
    defaultFile = path;
    //socket send
    io.sockets.emit("filechange");
  })
  .on("unlink", (path) => {
    log(`File ${path} has been removed`);
    defaultFile = path.join("web/default.html");
    //socket send
    io.sockets.emit("filechange");
  });
function handleHtml(html) {
  let index = html.indexOf("</body>");
  //增加socket代码
  let socketStirng = `<script src="/socket.io/socket.io.js"></script>
  <script>
    var socket = io();
    socket.on("filechange", function (msg) {
      location.reload();
      socket.close();
    });
  </script>`;
  let newhtml = html.slice(0, index - 1) + socketStirng + html.slice(index - 1);
  return newhtml;
}
//读取静态资源
function readStaticFile(res, filePathname) {
  //文件后缀
  var ext = path.parse(filePathname).ext;
  var mimeType = mime.getType(ext);
  if (ext) {
    try {
      let data = fs.readFileSync(filePathname);
      res.writeHead(200, {"Content-Type": mimeType});
      res.write(data);
      res.end();
    } catch (e) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      // res.write("404 - NOT FOUND");
      res.end();
    }
  }
}
