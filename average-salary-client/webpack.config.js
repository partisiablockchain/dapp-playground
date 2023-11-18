const webpackConfig = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PathPlugin = require("path");
const { merge } = require("webpack-merge");

function path(path) {
  return PathPlugin.join(__dirname, "src", path);
}

module.exports = (env) => {
  const port = env.PORT;

  const configuration = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
      historyApiFallback: true,
      port
    }
  };

  return merge(configuration, {
    entry: [path("main/Main")],
    resolve: {
      alias: {
        process: "process/browser"
      },
      extensions: [".ts", ".tsx", ".js"],
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert")
      }
    },
    output: {
      filename: "[name].[chunkhash].js",
      path: PathPlugin.join(__dirname, "target"),
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: path("main"),
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/typescript"
            ]
          }
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configOverwrite: {
            compilerOptions: {
              noUnusedLocals: false,
              noUnusedParameters: false
            }
          }
        }
      }),
      new HtmlWebpackPlugin({ template: path("main/index.html") }),
      new webpackConfig.ProvidePlugin({ Buffer: ["buffer", "Buffer"], process: "process/browser" })
    ].filter(Boolean)
  });
};
