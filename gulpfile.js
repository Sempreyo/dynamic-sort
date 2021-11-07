const {src, dest, parallel, series} = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const rigger = require('gulp-rigger');

function browsersync() {
   browserSync.init({
      server: {baseDir: 'build/'},
      notify: false,
      online: true,
      host: 'localhost',
      port: 3000
   })
}

function pugHtml() {
   return src('src/view/pages/*.pug')
      .pipe(plumber())
      .pipe(pug({pretty: true}))
      .pipe(dest('build/'))
      .pipe(browserSync.stream())
}

function scripts() {
   return src('src/js/main.js')
      .pipe(plumber())
      .pipe(rigger())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('./maps'))
      .pipe(dest('build/js/'))
      .pipe(browserSync.stream())
}

function styles() {
   return src('src/styles/main.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true}))
      .pipe(sourcemaps.write('./maps'))
      .pipe(dest('build/css/'))
      .pipe(browserSync.stream())
}


exports.browsersync = browsersync;
exports.pugHtml = pugHtml;
exports.scripts = scripts;
exports.styles = styles;

exports.build = series(pugHtml, styles, scripts);

exports.default = parallel(pugHtml, styles, scripts, browsersync);