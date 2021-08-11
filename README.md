<!--
 * @Description:
 * @version: 1.0.0
 * @Author: chenhong
 * @Date: 2021-08-11 14:17:07
 * @LastEditors: chenhong
 * @LastEditTime: 2021-08-11 14:20:46
-->

### html

html 结尾的文件都是静态页面，主要是参照
https://juejin.cn/post/6994349533807247397 这个完成练习

### app.js

app.js 是 node 的热更新，主要是监听 html 的改动，然后通过 socket 通知浏览器，然后浏览器刷新

### default.html

默认返回的 html，如果有最新改动的 html，就返回最新改动的页面

### 启动项目

```
//安装依赖
npm install
//启动服务
node app.js
```
