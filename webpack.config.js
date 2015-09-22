var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);

var common = {
	entry: path.resolve(ROOT_PATH, 'app'),
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: path.resolve(ROOT_PATH, 'build'),
		filename: 'bundle.js'
	}
};


if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
	
		devtool: 'eval-source-map',

		module: {
			loaders: [
				{
					test: /\.css$/,
					loaders: ['style','css'],
					include: path.resolve(ROOT_PATH, 'app')
				},
				{
					test: /\.jsx?$/,
					loaders: ['react-hot', 'babel'],
					include: path.resolve(ROOT_PATH, 'app')
				}
			]
		},

		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true
		},

		plugins: [
			new HtmlWebpackPlugin({
				title: 'Kanban app'
			}),
			new webpack.HotModuleReplacementPlugin()
		]
	});
}

if (TARGET === 'build') {
	module.exports = merge(common, {

		devtool: 'source-map',

		module: {
			loaders: [
				{
					test: /\.css$/,
					loaders: ['style','css'],
					include: path.resolve(ROOT_PATH, 'app')
				},
				{
					test: /\.jsx?$/,
					loaders: ['babel'],
					include: path.resolve(ROOT_PATH, 'app')
				}
			]
		},

		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	});
}











