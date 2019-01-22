// // gulpプラグインの読み込み
// const gulp = require('gulp');
// // gulpプラグインを読み込む
// const sass         = require('gulp-sass');
// var concat         = require('gulp-concat');
// const uglify       = require('gulp-uglify');
// const header       = require('gulp-header');
// const webserver    = require('gulp-webserver');
// // const plumber      = require('gulp-plumber');
// // const rename       = require('gulp-rename');
// // const htmlhint     = require('gulp-htmlhint');
// // const csslint      = require('gulp-csslint');
// // const autoprefixer = require('gulp-autoprefixer');
// // const cleancss     = require('gulp-clean-css');
// // const util         = require('gulp-util');
// // const browserify   = require('browserify');
// // const babelify     = require('babelify');
// // const source       = require('vinyl-source-stream');


// gulpプラグインの読み込み
const gulp     = require('gulp');
// Sassをコンパイルするプラグインの読み込み
const sass     = require('gulp-sass');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const uglify   = require('gulp-uglify');
const babel    = require('gulp-babel');

const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

// style.scssをタスクを作成する
// concat
gulp.task('scss.concat', function () {
    return gulp.src('public/assets/scss/*.scss')
    .pipe(plumber())
    .pipe(concat('style.scss'))
    .pipe(gulp.dest('public/assets/main-scss/'));
});
gulp.task('scss.compile', function () {
    // style.scssファイルを取得 ※return必須
    return gulp.src('public/assets/main-scss/style.scss')
        .pipe(plumber())
        // Sassのコンパイルを実行
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        // cssフォルダー以下に保存
        .pipe(gulp.dest('public/assets/css'));
});

// jsファイル用
// concat
gulp.task('js.concat', function () {
    return gulp.src('public/assets/js/chart/*.js')
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/assets/main-js/'));
});
// コードを見にくくuglify
gulp.task('js.uglify', function() {
    return gulp.src('public/assets/main-js/bundle.js')
      .pipe(plumber())
      .pipe(uglify('bundle.min.js'))
      .pipe(gulp.dest('public/assets/main-js/'));
});

// IE11対応
gulp.task('js.es5', function() {
    return gulp.src(['public/assets/main-js/bundle.js', BABEL_POLYFILL])
        .pipe(babel({
            "presets": [
                [
                    "@babel/preset-env", {
                        // import文をそのままにする
                        "modules": false,
                        "targets": {
                            "browsers": [">0.25% in JP", "not ie <= 10", "not op_mini all"]
                        },
                        // 必要なpolyfillプラグインを自動的に使う
                        // "useBuiltIns": "usage",
                    }
                ]
            ]
        }))
        .pipe(gulp.dest('public/assets/main-js/'));
});

gulp.task('js.webpack', function () {
    return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("public/assets/main-js/"));
});

// gulp.task('js', gulp.series('js.concat', 'js.uglify'));
// gulp.task('js', gulp.series('js.concat'));
gulp.task('js', gulp.series('js.concat', 'js.webpack'));
// gulp.task('js', gulp.series('js.concat','js.es5'));
gulp.task('scss', gulp.series('scss.concat', 'scss.compile'));



gulp.task('watch', function () {
    gulp.watch('public/assets/scss/*.scss', gulp.task('scss'));
    gulp.watch('public/assets/js/chart/*.js', gulp.task('js'));
});

gulp.task('default', gulp.series( gulp.parallel('scss', 'js')));
// gulp.task('default', gulp.series( gulp.parallel('scss', 'task1')));