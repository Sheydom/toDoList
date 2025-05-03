const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports={
    mode:"production", // enables automaization automatically
    devtool:"source-map", // create map file
    entry:"./index.js", //adjust point of entry
    output:{
        path:path.resolve(__dirname,"dist"),
        clean:true, // clean dist folder before new build
    },
    plugins:[new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
              {
                from: "./images", // Copy all images from src/images
                to: "images", // Place them in dist/images
              },
            ],
          })],
    
    optimization:{
        minimizer:[     new CssMinimizerWebpackPlugin({
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
          }), new TerserPlugin(), new ImageMinimizerPlugin({
            minimizer:{
                implementation: ImageMinimizerPlugin.imageminMinify,
                options:{
                    plugins:[
                        ["imagemin-pngquant", {quality:[0.5,0.6]}]
                    ]
                }
            }
        })]
    },
    module:{
        rules:[
            {
                test:/\.css$/i,
                use:[MiniCssExtractPlugin.loader,"css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // Match image files
                type:"asset",
            }
        ]
    }
}
