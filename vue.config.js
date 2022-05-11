module.exports = {
	publicPath: "./",
    devServer: {
		// 后端请求转发，此配置仅开发环境有效，生产环境请参考生产环境部署文档配置nginx转发
		proxy: {
			'/work': {
				target: 'http://192.168.6.105:8073/',
                changeOrigin: true,
			}
		},
		port:8001,
		inline:false //实时编译
	},

	outputDir: undefined,
}