var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('scripts', function () {
  return gulp.src('prebuild/**/*.ts')
    .pipe(ts({
      module: "commonjs",
      sourcemap: false,
      emitError: true
    }))
    .pipe(gulp.dest('release'));
});

gulp.task('watch', function() {
    gulp.watch('prebuild/**/*.ts', ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);