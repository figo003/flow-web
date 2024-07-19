// 使用node的path模块
const path = require('path')

module.exports = {
  devServer: {
        port: "8087",
        open: true,
        overlay: {
            warnings: false,
            errors: false,
            lintOnSave: false
        },
        proxy: {
            '/flowable': {
                target: 'http://127.0.0.1:8088',
                changeOrigin: true,                  // 用于控制请求头中的host值
                logLevel:"debug",
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/other': {
                target: 'http://127.0.0.1:8088',
                changeOrigin: true,                  // 用于控制请求头中的host值
                logLevel:"debug",
                pathRewrite: {
                    '^/api': '/'
                }
            },
        }
    }
}
