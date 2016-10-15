var gulp = require('gulp');
var conf = require('./gulpconf');
var requireDir = require('require-dir');
requireDir('./tasks', {recurse: true});

gulp.task('build', ['js-min'], function() {
  gulp.src( conf.paths.destDir + '/assets/js/*.js' )
    .pipe( gulp.dest( '../' ) );
});

gulp.task('default', ['watch', 'browser-sync']);