module.exports = {
    entry: './src/module.js',
    output: {
        library: "school-info-parser",
        libraryTarget: "umd",
        path: __dirname + '/dist/',
        filename: 'school-info-parser.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|example)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
