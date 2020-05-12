module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:7001", // 本地模拟数据服务器
        changeOrigin: true,
        pathRewrite: {
          "^/api": "" // 去掉接口地址中的api字符串
        }
      }
    }
  }
}