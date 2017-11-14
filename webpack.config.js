module.exports = {
    entry: './src/module.js',
    output: {
        filename: 'dist/school-info-parser.js'
     },
    target: 'node',
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
