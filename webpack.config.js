import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
// import CopyWebpackPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  // Use ES6 module syntax
  mode: "production", // enables automaization automatically
  devtool: "source-map", // create map file
  entry: "./src/js/script.js", //adjust point of entry
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true, // clean dist folder before new build
  },
  plugins: [
    new MiniCssExtractPlugin( {filename: "styles.css"})
   
    //  new CopyWebpackPlugin({
    //    patterns: [
    //      {
    //        from: "./images", // Copy all images from src/images
    //        to: "images", // Place them in dist/images
    //      },
    //    ],
    //  }),
  ],

  optimization: {
    minimizer: [
      new CssMinimizerWebpackPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              // Disable merging longhand properties (e.g., margin: 1px 2px 3px 4px -> margin: 1px 2px)
              mergeLonghand: true,
              // Disable unused CSS removal
              discardUnused: true,
              // Don't remove white space completely, allow some whitespace to remain for readability
              normalizeWhitespace: true,
              // Retain CSS comments for debugging purposes (optional)
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [["imagemin-pngquant", { quality: [0.5, 0.6] }]],
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Match image files
        type: "asset",
      },
    ],
  },
  devServer: {
    static: "./", // Serve files from this folder
    port: 3000, // You can change the port if needed
    open: true, // Auto-open in your browser
    hot: true, // Enable hot reloading (optional but nice)
  },
};
