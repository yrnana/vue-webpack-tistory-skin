const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
	const isDev = argv.mode === 'development'

	const config = {
		entry: './src/index.js',
		output: {
			filename: './images/bundle.js',
			chunkFilename: './images/bundle.[id].js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.html$/,
					use: 'html-loader',
				},
				{
					test: /\.css$/,
					use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
				{
					test: /\.less$/,
					use: [
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'less-loader',
							options: {
								modifyvars: {
									'@font-family': "'Noto Sans DemiLight', sans-serif",
									'@select-item-selected-font-weight': 500,
								},
								javascriptEnabled: true,
							},
						},
					],
				},
			],
		},
		resolve: {
			alias: {
				vue$: 'vue/dist/vue.js',
			},
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: 'src/index.ejs',
				filename: 'skin.html',
				minify: false,
				inject: false,
			}),
		],
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		},
	}

	if (isDev) {
		config.devServer = {
			index: 'skin.html',
			open: true,
			hot: true,
			before(app, server) {
				server._watch('src/*.ejs')
			},
		}
		config.plugins.push(new webpack.HotModuleReplacementPlugin())
	} else {
		config.resolve.alias.vue$ = 'vue/dist/vue.min.js'
		config.plugins.push(
			...[
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': JSON.stringify('production'),
				}),
				new MiniCssExtractPlugin({
					filename: './style.css',
					chunkFilename: './images/style.[id].css',
				}),
			]
		)
	}

	return config
}
