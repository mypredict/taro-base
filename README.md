# taro-base
超级日历

# 依赖工具
npm install -g @tarojs/cli

# 开发环境
1. 装包: yarn
2. 启动: yarn dev:weapp

# 目录介绍
|
|- config
|    dev.js // 开发环境的配置
|    index.js // 开发和打包的基本共同配置
|    prod.js // 打包环境的配置
|
|- src
|    |- apis // 页面中所有的api定义发起
|    |- assets // 所有的静态资源
|    |    image // 所有图片资源
|    |    css // 包含全局scss定义
|    |- components // 所有的基础组件和物料组件
|    |- custom-hooks // 自定义hooks
|    |- lib // 封装的或者第三方工具
|    |    request // 请求库
|    |- pages // 所有的页面
|    |- router // 所有的页面路由和导航路由
|    |- utils // 工具函数
|    app.config.js // 路由配置及主题等
|    app.js // 页面入口
|
|- jsconfig.js // alias配置给vscode使用
|
|- project.tt.json // 此处配置微信appid
|