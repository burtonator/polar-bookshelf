const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');
const os = require('os');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const {DefaultRewrites} = require('polar-backend-shared/src/webserver/DefaultRewrites');

const isDevServer = process.env.WEBPACK_DEV_SERVER;
const mode = process.env.NODE_ENV || (isDevServer ? 'development' : 'production');
const isDev = mode === 'development';
const target = process.env.WEBPACK_TARGET || 'web';
const devtool = isDev ? (process.env.WEBPACK_DEVTOOL || "inline-source-map") : "source-map";

const workers = os.cpus().length - 1;

const OUTPUT_PATH = path.resolve(__dirname, 'dist/public');

console.log("Using N workers: " + workers);
console.log("mode: " + mode);
console.log("isDevServer: " + isDevServer);
console.log("isDev: " + isDev);
console.log("WEBPACK_TARGET: " + target);
console.log("WEBPACK_DEVTOOL: " + devtool);
console.log("Running in directory: " + __dirname);
console.log("Writing to output path: " + OUTPUT_PATH);

function createRules() {

    const rules = [

        // https://github.com/webpack-contrib/cache-loader
        //
        // looks like with the cache loader the initial compile is about 10%
        // longer but 2x faster once the cache is running.
        {
            loader: 'cache-loader',
            options: {
                cacheDirectory: '.webpack-cache-loader'
            }
        },
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'thread-loader',
                    options: {
                        // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                        workers,
                        // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                        workerParallelJobs: 100,
                        poolTimeout: 2000,
                    }
                },
                {
                    loader: 'ts-loader',
                    options: {
                        // performance: this improved performance by about 2x.
                        // from 20s to about 10s
                        transpileOnly: true,
                        experimentalWatchApi: true,

                        // IMPORTANT! use happyPackMode mode to speed-up
                        // compilation and reduce errors reported to webpack
                        happyPackMode: true

                    }
                }

            ]

        },
        {
            // all image and font assets including SVG, TTFs and an optional
            // v=xxx identifier at the end if we want to use one.
            test: /\.(png|jpe?g|gif|bmp|svg|ico|webp|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[contenthash].[ext]',
                        outputPath: 'assets',
                        publicPath: '/assets'
                    }
                },
            ],
        },
        {
            test: /\.css$/i,
            use: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader'
                }
            ]
        },
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
            test: /fonts\.googleapis\.com\/css/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[contenthash].[ext]',
                        outputPath: 'assets',
                        publicPath: '/assets'
                    }
                },
            ],
        },

    ];

    if (target !== 'electron-renderer') {

        const electronPath = path.resolve(__dirname, '../../node_modules/electron/index.js')

        if (! fs.existsSync(electronPath)) {
            throw new Error("Electron dir doesn't exist: " + electronPath)
        }

        console.log("Adding null-loader for electron libraries: " + electronPath);
        rules.push({
            test: electronPath,
            use: 'null-loader'
        })
    }

    return rules;

}

function createNode() {

    if (target === 'electron-renderer') {
        return {};
    } else {
        return {
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        }
    }

}

module.exports = {
    mode,
    // stats: 'verbose',
    target,
    entry: {
        "repository": "./apps/repository/js/entry.tsx",
        "dev": "./apps/dev2/index.tsx",
        // "preview": "./apps/preview/index.ts",
        // "add-shared-doc": "./apps/add-shared-doc/js/index.ts",
    },
    module: {
        rules: createRules()
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js'],
        alias: {
        }
    },
    devtool,
    output: {
        path: OUTPUT_PATH,
        filename: '[name]-bundle.js',
    },
    node: createNode(),
    plugins: [
        // TODO: this won't be needed once we get rid of summernote .... it
        // should be the only thing depending on jquery moving forward.
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery"
        }),
        // new BundleAnalyzerPlugin(),
        new ForkTsCheckerWebpackPlugin({}),
        // WARNING: this will ONLY be rebuilt when:
        //
        // - running with webpack (not webpack-dev-server because it will break)
        //
        // - when the .webpack-cache-loader directory is first removed
        ! isDevServer && new CopyPlugin({
            patterns: [

                // ***** pdf.js
                //
                // this is a bit of a hack and it would be better if we supported
                // this better and managed as part of webpack directly and copied
                // these as assets I think but the main issue is that the paths
                // need to be preserved AND they actually need to be loaded but
                // PDF.js doesn't link to them directly

                { from: '../../node_modules/pdfjs-dist/web/pdf_viewer.css', to: '.'},
                { from: '../../node_modules/pdfjs-dist/cmaps', to: './pdfjs-dist/cmaps' },
                { from: '../../node_modules/pdfjs-dist/build/pdf.worker.js', to: './pdfjs-dist' },

                // ***** apps
                { from: './apps/**/*.html', to: './'},
                { from: './apps/**/*.css', to: './'},
                { from: './apps/**/*.svg', to: './'},
                { from: './apps/init.js', to: './apps'},
                { from: './apps/service-worker-registration.js', to: './apps'},
                { from: './pdfviewer-custom/**/*.css', to: './'},

                // ***** misc root directory files

                { from: './*.ico', to: './'},
                { from: './*.png', to: './'},
                { from: './*.svg', to: './'},
                { from: './sitemap*.xml', to: './'},
                { from: './robots.txt', to: './'},
                { from: './manifest.json', to: './'},
                { from: './apps/repository/index.html', to: './'},

            ],
        }),
        ! isDevServer && new GenerateSW({
            // include: [
            //     "**"
            // ],
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            directoryIndex: 'index.html',
            // stripPrefix: 'dist/public',
            maximumFileSizeToCacheInBytes: 150000000,
            swDest: 'service-worker.js',
            runtimeCaching: [
                {
                    // cache document URLs returned by polar so that they are
                    // available for reading offline...
                    //
                    // if we setup custom domains for hosting polar apps in the
                    // future this will have to be configured.
                    //
                    // https://storage.googleapis.com/polar-32b0f.appspot.com/stash/12qGEt93LdQiyfC86gd3zNabtvZcb86spmbhkwuv.epub

                    urlPattern: /https:\/\/storage\.google\.com\/polar-32b0f\.appspot\.com\/stash/,
                    handler: 'CacheFirst'
                },
                {
                    // these URLs are immutable based on content hash as computed by
                    // webpack so just use cacheFirst which only fetches them the
                    // first time
                    urlPattern: /https:\/\/storage.google.com\/stash/,
                    handler: 'CacheFirst'
                },
                {
                    urlPattern: /https:\/\/fonts.google.com\//,
                    handler: 'CacheFirst'
                },
                {
                    urlPattern: /https:\/\/lh5.googleusercontent.com\//,
                    handler: 'CacheFirst'
                }
            ],
            modifyURLPrefix: {
                // Remove a '/dist' prefix from the URLs:
                '/dist/public': ''
            }
        })
    ].filter(Boolean),
    optimization: {
        minimize: ! isDev,
        minimizer: [new TerserPlugin({
            // disable caching to:  node_modules/.cache/terser-webpack-plugin/
            // because intellij will index this data and lock up my machine
            // and generally waste space and CPU
            cache: ".terser-webpack-plugin",
            terserOptions: {
                output: { ascii_only: true },
            }})
        ],
        // usedExports: true,
        // removeAvailableModules: true,
        // removeEmptyChunks: true,
        // splitChunks: {
        //     chunks: 'all'
        // },
    },
    watchOptions: {
    },
    devServer: {
        contentBase: path.resolve('dist/public'),
        compress: true,
        port: 8050,
        open: true,
        overlay: true,
        hot: true,
        watchContentBase: false,
        writeToDisk: true,
        historyApiFallback: {
            rewrites: [
                // TODO: load DefaultRewrites here and convert them...
                { from: /^\/login$/, to: '/apps/repository/index.html' },
            ]
        }
    }
};
