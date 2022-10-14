
export default {
  mode: "development",
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env", 
              "@babel/preset-react"
            ]
          }
        }
      }
    ]
  },
  devtool: 'inline-source-map'
}