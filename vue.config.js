module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:7001", // 本地模拟数据服务器
        changeOrigin: true,
        pathRewrite: {
          "^/api": "" // 去掉接口地址中的api字符串
        }
      },
      "/control":{
        target: "http://localhost:7001",
        changeOrigin: true,
        pathRewrite: {
          "^/control": ""
        }
      },
      "/message": {
        target: "http://localhost:7002", // 本地模拟数据服务器
        changeOrigin: true,
        pathRewrite: {
          "^/message": "" // 去掉接口地址中的api字符串
        }
      }
    }
  }
}