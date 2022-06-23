const typescriptIsTransformer =
  require("typescript-is/lib/transform-inline/transformer").default;
const path = require("path");
const { readdirSync } = require("fs");
var ZipPlugin = require("zip-webpack-plugin");

const dir = "lambdas";
const entry = readdirSync(dir)
  .filter((item) => /\.(t|j)s$/.test(item))
  .filter((item) => !/\.d\.(t|j)s$/.test(item))
  .reduce(
    (acc, fileName) => ({
      ...acc,
      [fileName.replace(/\.(t|j)s$/, "")]: `./${dir}/${fileName}`,
    }),
    {}
  );
const distFolder = "dist";
const distPath = path.resolve(process.cwd(), distFolder);

module.exports = {
  entry,
  mode: "production",
  module: {
    rules: [
      {
        loader: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
        options: {
          getCustomTransformers: (program) => ({
            before: [typescriptIsTransformer(program)],
          }),
        },
      },
    ],
  },
  resolve: {
    modules: [  
      "node_modules"
    ],
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  target: "node",
  stats: "minimal",
  optimization: {
    usedExports: true,
  },
  output: {
    libraryTarget: "umd",
    filename: "[name]/index.js",
    path: distPath,
  },
  plugins: Object.keys(entry).map((entryName) => {
    return new ZipPlugin({
      path: path.resolve(__dirname, "dist/"),
      filename: entryName,
      extension: "zip",
      include: [entryName],
    });
  }),
};
