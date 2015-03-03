var gulp = require('gulp')
    compress = require('gulp-yuicompressor')
    rename = require('gulp-rename')

gulp.task('build', ['build:minify']);

gulp.task('build:minify', function() {
  return gulp.src('./common-web.js')
    .pipe(compress({ type: 'js' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function() {
  return gulp.watch(['common-web.js'], ['build']);
});

gulp.task('default', ['build', 'watch']);
