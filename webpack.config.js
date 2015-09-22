var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = require('./package.json');

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
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Kanban app'
		})
	]
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
			new webpack.HotModuleReplacementPlugin()
		]
	});
}

if (TARGET === 'build') {
	module.exports = merge(common, {

		entry: {
			app: path.resolve(ROOT_PATH, 'app'),
			vendor: Object.keys(pkg.dependencies)
		},

		output: {
			path: path.resolve(ROOT_PATH, 'build'),
			filename: '[name].js?[chunkhash]'
		},

		devtool: 'source-map',

		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract('style','css'),
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
			new Clean(['build']),
			new ExtractTextPlugin('styles.css?[chunkhash]'),
			new webpack.optimize.CommonsChunkPlugin(
				'vendor',
				'[name].js?[chunkhash]'
			),
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











