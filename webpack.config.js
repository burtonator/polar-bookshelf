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
const svgToMiniDataURI = require('mini-svg-data-uri');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");


const isDevServer = process.argv.includes('serve');
const mode = process.env.NODE_ENV || (isDevServer ? 'development' : 'production');
const isDev = mode === 'development';
const target = process.env.WEBPACK_TARGET || 'web';
const devtool = isDev ? (process.env.WEBPACK_DEVTOOL || "inline-source-map") : "source-map";
const useWorkbox = ! isDevServer;
const bundle = determineBundle();
const port = determinePort(bundle);
const openPage = determineOpenPage(bundle);

const workers = os.cpus().length - 1;

const output = path.resolve(__dirname, 'dist/public');

console.log("Usage: ===================");

console.log(" - export WEBPACK_BUNDLE to 'stories' or 'repository' (default) to change the bundle being built");
console.log(" - export WEBPACK_DEVTOOL to 'inline-source-map' for better symbols (but slower build)");

console.log("Environment: =============");
console.log("WEBPACK_TARGET: " + process.env['WEBPACK_DEVTOOL']);
console.log("WEBPACK_BUNDLE: " + process.env['WEBPACK_BUNDLE']);

console.log("Config: ==================");

console.log("workers:      " + workers);
console.log("bundle:       " + bundle);
console.log("port:         " + port);
console.log("openPage:     " + openPage);
console.log("mode:         " + mode);
console.log("isDev:        " + isDev);
console.log("isDevServer:  " + isDevServer);
console.log("devtool:      " + devtool);
console.log("useWorkbox:   " + useWorkbox);
console.log("output:       " + output);
console.log("__dirname:    " + __dirname);

// TODO: first time we run this when using 'webpack serve' make sure
// dist/public is setup and that webpack was run first.

if (isDev && bundle === null) {
    throw new Error("MUST export WEBPACK_BUNDLE to either 'repository' or 'stories' in serve mode.");
}

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
            test: /\.(jsx|tsx|ts)$/,
            exclude: [
                /node_modules/,
            ],
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
                        transpileOnly: isDev,
                        experimentalWatchApi: true,

                        // IMPORTANT! use happyPackMode mode to speed-up
                        // compilation and reduce errors reported to webpack
                        happyPackMode: true

                    }
                }

            ]

        },
        {
            test: /\.(png|jpe?g|gif|bmp|ico|webp|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
            exclude: [
            ],
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
            // make SVGs use data URLs.
            test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/i,
            exclude: [
            ],
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 32768,
                        generator: (content) => svgToMiniDataURI(content.toString()),
                    }
                },
            ],
        },
        {
            test: /\.css$/i,
            exclude: [
            ],
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

        const electronPath = path.resolve(__dirname, '../../node_modules/electron/index.js');

        if (! fs.existsSync(electronPath)) {
            throw new Error("Electron dir doesn't exist: " + electronPath);
        }

        console.log("Adding null-loader for electron libraries: " + electronPath);
        rules.push({
            test: electronPath,
            use: 'null-loader'
        });
    }

    return rules;

}

function determineBundle() {

    switch (process.env['WEBPACK_BUNDLE']) {

        case 'stories':
            return 'stories';

        case 'repository':
            return 'repository';

        default:
            return null;

    }

}

function determinePort(bundle) {

    switch (bundle) {

        case 'stories':
            return 8051;

        case 'repository':
        default:
            return 8050;
    }

}

function determineOpenPage(bundle) {

    switch (bundle) {

        case 'stories':
            return 'apps/stories';

        case 'repository':
        default:
            return '';
    }

}

function createEntries(bundle) {

    switch (bundle) {

        case 'stories':

            return {
                "stories": "./apps/stories/index.tsx",
            };

        case 'repository':
            return {
                "repository": "./apps/repository/js/entry.tsx",
            };

        default:

            return {
                "stories": "./apps/stories/index.tsx",
                "repository": "./apps/repository/js/entry.tsx",
            };


    }

}

const entries = createEntries(bundle);

console.log("Building with entries: ", entries);

module.exports = {
    mode,
    // stats: 'verbose',
    target,
    cache: {
        type: 'memory'
    },
    entry: entries,
    module: {
        rules: createRules()
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.jsx'],
        alias: {
        },
        fallback: {
            fs: false,
            net: false,
            tls: false,
        }
    },
    devtool,
    output: {
        path: output,
        filename: '[name]-bundle.js',
    },
    plugins: [
        new webpack.ProgressPlugin({
            activeModules: false,
            entries: true,
            // handler(percentage, message, ...args) {
            //     // custom logic
            // },
            modules: true,
            modulesCount: 5000,
            profile: false,
            dependencies: true,
            dependenciesCount: 10000,
            percentBy: null,
        }),
        new NodePolyfillPlugin(),

        // TODO: this is needed for a localized build and it does not support en
        // TODO: this won't be needed once we get rid of summernote .... it
        // should be the only thing depending on jquery moving forward.
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery"
        }),
        isDevServer && new webpack.HotModuleReplacementPlugin({}),
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
                    urlPattern: /https:\/\/widget\.intercom\.io\/widget\//,
                    handler: 'CacheFirst'
                },
                {
                    urlPattern: /https:\/\/canny\.io\/sdk\.js\//,
                    handler: 'CacheFirst'
                },
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
                },
                {
                    urlPattern: /https:\/\/js\.stripe\.com\/v3/,
                    handler: 'StaleWhileRevalidate'
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
            // cache: ".terser-webpack-plugin",
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
        port,
        open: true,
        openPage,
        overlay: true,
        hot: true,
        watchContentBase: false,
        writeToDisk: true,
        disableHostCheck: true,
        historyApiFallback: {
            rewrites: [
                // TODO: load DefaultRewrites here and convert them...
                { from: /^\/login$/, to: '/apps/repository/index.html' },
                { from: /^\/apps\/stories/, to: '/apps/stories/index.html' },
            ]
        }
    },
};
