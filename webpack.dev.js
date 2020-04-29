const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

/* Export configuration */
module.exports = {
    mode: 'development',
    plugins: [
        new HtmlPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new CopyPlugin([
                { from: 'public', to: '' }, 
            ], {
                ignore: ['.gitignore'],
            }
        )
    ], 
    devServer: {
        contentBase: "./dist",
        hot: true,
        inline: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }, {
                test: /\.css$/,
                exclude: /[\/\\]src[\/\\]/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {loader: 'css-loader'}
                ]
            }, {
                test: /\.css$/,
                exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    }
                ]
            }, {
                test: /\.(png|svg|jpg)$/,
                use: [
                    'file-loader',
                ],
            }
        ]
    },
    resolve: { 
        extensions: [".web.ts", ".web.js", ".ts", ".js"] 
    },
}
