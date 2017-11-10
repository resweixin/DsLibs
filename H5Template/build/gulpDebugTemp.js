var gulp = require('gulp'); //gulp
var fs = require('fs'); //文件系统
var glob = require('glob');
var path = require('path'); //路径习题
var del = require('del'); //文件删除
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var browserSync = require('browser-sync').create(); //自动刷新调试
var less = require('gulp-less'); //less编译
var lazyImageCSS = require('gulp-lazyimagecss'); // 自动为图片样式添加 宽/高/background-size 属性
var minifyCSS = require('gulp-minify-css'); //压缩css
// var concat = require('gulp-concat');//合并js文件成一个 有webpack后这个没有存在必要【不需要】
var usemin = require('gulp-usemin2'); //剥离html里面开发插入的js，替换成压缩的min
var uglify = require('gulp-uglify'); //js压缩
var rename = require('gulp-rename'); //重新命名
var removeCode = require('gulp-remove-code'); //进行删除指定块的代码
var replace = require('gulp-replace'); //进行字符替换
// var imagemin = require('gulp-imagemin');//jpg图片压缩 使用pp鸭 【不需要】
// var pngquant = require('imagemin-pngquant');//png图片压缩 【不需要】
// var webpack = require("webpack"); //webpack
// var _ = require('lodash'); //webpack配置更改

/**
 * 刷新浏览器
 * @param  {[type]} value ['*.css']
 * @return {[type]}       [description]
 */
function browserReload(value) {
    if (value) browserSync.reload(value);
    else browserSync.reload();
}

/**
 * 开发目录
 * @type {Object}
 */
var developmentConfig = {
    //监听 html 文件刷新
    html: ['../*.html', '../html/**/*.html'],
    //js html css 需要经过webpack编译
    src: ['../src/**/*.js', '../src/**/*.html', '../src/**/*.css', '../src/**/*.vue'],
    //编译出来文件目录
    dist: '../js/app/',
    //需要监听编译less文件
    lesswatch: ['../less/*.less', '../less/**/*.less'],
    //需要编译的less文件
    lessbuild: ['../less/*.less'],
    //less to css路径
    cssPath: "../css/",
    //css 变化监听
    css: ['../css/*.css'],
    //js 变化监听
    js: ['../js/**/*.js'],
};
/**
 * 清除webpack编译打包
 * @type {[type]}
 */
gulp.task('clean:webpack', function () {
    return del([
        developmentConfig.dist,
    ], {
        force: true
    });
});
// 只要server
gulp.task('server', function () {
    //启动browserSync服务
    browserSync.init({
        server: '../',
        port: 8001,
        open: "external"
    });
    //less编译监听
    watch(developmentConfig.lesswatch, {
        verbose: true
    }, function (e) {
        var cb = e.history[0];
        gulp.src(developmentConfig.lessbuild)
            .pipe(less().on('error', function (error) {
                console.log(error.message);
            }))
            .pipe(lazyImageCSS()) //自动为图片样式添加 宽/高/background-size 属性
            //.pipe(minifyCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(developmentConfig.cssPath));
    });
    //html变化监听
    watch(developmentConfig.html, {
        verbose: true
    }, function (event) {
        browserReload('*.html');
    });
    //js变化
    watch(developmentConfig.js, {
        verbose: true
    }, function (event) {
        browserReload();
    });
    //css 变化监听
    watch(developmentConfig.css, {
        verbose: true
    }, function (e) {
        browserReload('*.css');
    });
});

gulp.task('dssource', function () {



    gulp.src([
        '../../src/ds/**/*.*',
    ]).pipe(
        copy("../src/ds/", {prefix: 0})
    );


    gulp.watch(['../../src/ds/**/*.*'], function (event) {

        var _path = event.path; //'..' + event.path.slice(event.path.indexOf("/src/ds/"));
        var _fileName = event.path.slice(event.path.lastIndexOf("/src/ds/") + 8);
        var _file = '../src/ds/' + _fileName;
        var _outPath = _file.slice(0, _file.lastIndexOf("/"));

        // console.log('File ' + event.path + ' was ' + event.type + ', running tasks>>', _path, ">>",
        //     _fileName,
        //     '_outPath:',_outPath
        // );

        if (event.type === 'deleted') {
            del([_file], {force: true});
        }
        if (event.type === 'added' || event.type === 'changed') {

            gulp.src([_path]).pipe(gulp.dest(_outPath));

        }

    });





});

gulp.task('default', ['dssource', 'clean:webpack', 'server']);

// gulp.task('default', ['dssource']);