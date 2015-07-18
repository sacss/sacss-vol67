'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var npm = (process.platform === "win32" ? "npm.cmd" : "npm");

var AUTOPREFIXER_BROWSERS = [
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 9',
  'iOS >= 6',
  'Safari >= 6'
];

gulp.task('styles', function () {
  return gulp.src([
      '_source/**/*.scss'
    ])
    .pipe($.sass({errLogToConsole: true})
      .on('error', console.error.bind(console))
    )
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.if('*.css', $.csscomb()))
    .pipe(gulp.dest('html'))
    .pipe($.size({title: 'css'}))
    .pipe(reload({stream:true}));
});

gulp.task('server', ['styles'], function () {
   browserSync.init({
    server: {
      baseDir: "html"
    }
  });

  gulp.watch(['html/**/*.html'], reload);
  gulp.watch(['_source/**/*.{scss,css}'], ['styles']);
});

// Build Production Files, the Default Task
gulp.task('default', function (cb) {
  runSequence('styles', ['server'], cb);
});

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
