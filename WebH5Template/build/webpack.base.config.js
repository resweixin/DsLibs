/**
 * 公共配置
 */
var path = require('path');

function resolveBowerPath(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    //别名
    resolve: {
        alias: {
            assets: resolveBowerPath('./assets'),
            images: resolveBowerPath('./images'),
            libs: resolveBowerPath('./src/libs'),
            app: resolveBowerPath('./src/app'),
            ds: resolveBowerPath('./src/Ds'),
            pixipath: 'libs/pixi',
            //vue需要用到
            'vue$': 'vue/dist/vue.esm.js',
            'vuex$': 'vuex/dist/vuex.esm.js',
            //'vue$': 'libs/vue/vue.min.js',
            //'vuex$': 'libs/vue/vuex.min.js',
            //'vuex$': 'libs/vue/vuex.esm.js',
            //jquery: 'libs/base/jquery-2.1.3.min.js',
            //jquery: 'libs/base/jquery-1.9.1.min.js',
            jquery: 'libs/base/zepto.min.js',
            //shrek
            jstween: 'libs/shrek/jstween.min.js',
            jstimeline: 'libs/shrek/jstimeline.min.js',
            css3d: 'libs/shrek/css3d.min.js',
            orienter: 'libs/shrek/orienter.js',
            //常用第三方库
            tweenmax: 'libs/greensock/TweenMax.min.js',
            timelinelite: 'libs/greensock/TimelineLite.min.js',
            tweenlite: 'libs/greensock/TweenLite.min.js',
            hammer: 'libs/touch/hammer.min.js',
            touchjs: 'libs/touch/touch.min.js',
            iscrolllite: 'libs/iscroll/iscroll-lite.min.js',
            uaparser: 'libs/parser/ua-parser.min.js',
            socketio: 'libs/socket.io/socket.io.js',
            //视频媒体
            iphoneinlinevideo: 'libs/media/iphone-inline-video.browser.js',
            jsmpg: 'libs/media/jsmpg.js',
            //createjs库
            createjs: 'libs/createjs/createjs0.8.2.min.js',
            easeljs: 'libs/createjs/easeljs-0.8.2.min.js',
            tweenjs: 'libs/createjs/tweenjs-0.6.2.min.js',
            preloadjs: 'libs/createjs/preloadjs-0.6.2.min.js',
            soundjs: 'libs/createjs/soundjs-0.6.2.min.js',
            //pixi

            pixi: 'libs/pixi/pixi.min.js',
            pixianimate: 'libs/pixi/pixi-animate.min.js',
            pixidragonBones: 'libs/pixi/dragonBones.min.js',
            //DsLibs
            eventdispatcher: 'ds/core/EventDispatcher.js',
            moblieresizemodel: 'ds/core/MoblieResizeModel.js',
            dscreatejs: 'ds/createjs/index.js',
        }
    },
    //模块loader进行字符串的处理
    module: {
        // webpack 2.0后的loader方式
        rules: [
            //vue模块加载器
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    //vue里面其他加载器
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                        'less': 'vue-style-loader!css-loader!less-loader?indentedSyntax',
                    }
                }
            },
            //html处理
            {test: /\.html$/, loader: 'html-loader'},
            //处理ES6
            {test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/,},
            //处理样式，转成css，如：less-loader, sass-loader
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader?sourceMap'
                ]
            },
            //图片资源 如果小于limit值（10k）会编译成base64 如果是超过会打包到会打包到./images目录下
            //平时可以考虑不适用
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '../../images/dist/[hash].[ext]', //会打包到./images目录下
                            limit: 10000//10k
                        }
                    },
                ]
            },
        ],
    },
};
