var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');

gulp.task('stylus', function() {
    gulp.src('./css/*.styl')
        .pipe(stylus({ compress: true }))
        .pipe(gulp.dest('./css'));
});

gulp.task('jade', function() {
    gulp.src('./index.jade')
        .pipe(jade({ prety: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['stylus', 'jade']);