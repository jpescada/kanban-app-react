var fs = require('fs');
var React = require('react');

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var App = require('./app/components/App.jsx');
var pkg = require('./package.json');


const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);
const APP_TITLE = 'Kanban app';

const common = {
	
	entry: path.resolve(ROOT_PATH, 'app'),
	
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	
	output: {
		path: path.resolve(ROOT_PATH, 'build'),
		filename: 'bundle.js'
	},

	module: {
		preLoaders: [
			{
				test: /\.css$/,
				loaders: ['csslint'],
				include: path.resolve(ROOT_PATH, 'app')
			},
			{
				test: /\.jsx?$/,
				loaders: ['eslint'],
				include: path.resolve(ROOT_PATH, 'app')
			}
		]	
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
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				title: APP_TITLE
			})
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
			}),
			new HtmlWebpackPlugin({
				title: APP_TITLE,
				templateContent: renderTemplate(
					fs.readFileSync(path.join(__dirname, 'templates/index.tpl'), 'utf8'),
					{
						app: React.renderToString(<App />)
					})
			})
		]
	});
}

function renderTemplate(template, replacements) {
	return function(){
		return template.replace(/%(\w*)%/g, function(match) {
			var key = match.slice(1, -1);
			return replacements[key] ? replacements[key] : match;
		});
	};
}











