'use strict';

const del = require('del');
const { task } = require('gulp');

var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    stylelint = require('gulp-stylelint'),
    deleteCss = require('del'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require ('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

var paths = {
  css: {
    src: './src/sass/*.scss',
    dest: './dist/css'
  },
  js: {
    src: './src/js/*.js',
    dest: './dist/js'
  },
  html: {
    src: './src/*.html',
    dest: './dist'
  },
  images: {
    src: './src/images/*{.png,.jpg,.svg}',
    dest: './dist/images'
  }
}

function styles() {
  return gulp
    .src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}

function Gulpstylelint() {
  return gulp
    .src(paths.css.src)
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    })
  );
}

function javascript() {
  return gulp
    .src(paths.js.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(paths.css.src, styles);
  gulp.watch(paths.css.src, Gulpstylelint);
  gulp.watch(paths.js.src, javascript);
  gulp.watch(paths.html.src, html).on('change', browserSync.reload);
}

// Exports watch task.
exports.watch = watch;
var build = gulp.parallel(styles, Gulpstylelint, javascript, html, images);
gulp.task('default', build);

// Exports clean task.
function cleanCss() {
  return deleteCss(['./dist/css/*'], {force: true});
}

exports.cleanCss = clean;
var clean = gulp.parallel(cleanCss);
gulp.task('clean', clean);
