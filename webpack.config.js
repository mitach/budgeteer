const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        dashboard: './src/dashboard.js',
        expenses: './src/expenses.js',
        summary: './src/summary.js',
        budget: './src/budget.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
        static: {
          directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 9000,
    },
};