const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
const webpack = require("webpack");
const IncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const ThemeColorReplacer = require("webpack-theme-color-replacer");
const { getThemeColors, modifyVars } = require("./src/common/theme/themeUtil");
const {  resolveCss} = require("./src/common/theme/theme-color-replacer-extend");

const isProduction = process.env.NODE_ENV === "production";
let glob = require("glob");
function getEntry(globPath) {
  let entries = {},
    basename,
    tmp,
    pathname;
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split("/").splice(-3);
    pathname = basename; // 正确输出js和html的路径
    var fileIs = glob.sync(entry + tmp[1] + ".html");
    if (tmp[1] === "common") {
      return;
    }
    entries[pathname] = {
      entry: "src/" + tmp[0] + "/" + tmp[1] + "/main.js",
      template: fileIs.length
        ? "src/" + tmp[0] + "/" + tmp[1] + "/" + tmp[1] + ".html"
        : "public/index.html",
      title: "",
      filename: tmp[1] + ".html",
      chunks: ["chunk-vendors", "chunk-common", pathname]
    };
  });
  return entries;
}
module.exports = {
  publicPath: process.env.BASE_URL,
  productionSourceMap: false,
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/styles/theme.less")]
    }
  },
  chainWebpack: config => {
    config.module.rules.delete("svg");
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProduction) {
      config.plugin("optimize-css").tap(args => {
        args[0].cssnanoOptions.preset[1].colormin = false;
        return args;
      });
    }
  },
  css: {
    extract: true,
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: modifyVars(),
        lessOptions: {
          modifyVars: modifyVars()
        }
      }
    }
  },
  pages: getEntry("./src/pages/**?/"),
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100
        })
      );
    }
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: "css/theme-colors-[contenthash:8].css",
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    );
    return {
      devtool: "cheap-source-map",
      externals: {
        vue: "Vue",
        "vue-router": "VueRouter",
        moment: "moment",
        vuex: "Vuex",
        "ant-design-vue": "antd"
      },
      plugins: [
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: path.resolve(__dirname, "dll", "manifest.json")
        }),
        new IncludeAssetsPlugin({
          assets: [
            {
              path: "dll",
              glob: "*.js",
              globPath: path.join(__dirname, "dll")
            }
          ],
          append: false
        }),
        new CopyWebpackPlugin([
          {
            from: path.join(__dirname, "dll"),
            to: path.join(__dirname, "dist", "dll")
          }
        ])
      ]
    };
  }
};
