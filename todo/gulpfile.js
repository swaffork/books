// Node task manager! We don't have to manually run everything to start
// Also, lets us continue developing without stopping and starting server! Wow!
(function() {
  'use strict';

  var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    _paths = ['server/**/*.js', 'client/js/*.js'];


  // How we start the server through nodemon
  gulp.task('nodemon', function() {
    nodemon({
      script: 'server/app.js',
      env: {
        'NODE_ENV': 'development'
      }
    })
      .on('restart');
  });

  // If we change a file, reload!
  gulp.task('watch', function() {
    livereload.listen();
    gulp.src(_paths, {
      read: false
    })
      .pipe(watch({
        emit: 'all'
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
    watch(_paths, livereload.changed);
  });

  // Lint: check our js for errors in a very tidy way!
  gulp.task('lint', function() {
    gulp.src(_paths)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });


  // When enter `gulp` command, this is default task that executes:
  gulp.task('default', ['lint', 'nodemon', 'watch']);

}());
