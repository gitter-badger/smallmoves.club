var gulp = require('gulp'),
    sass = require('gulp-ruby-sass');

gulp.task('styles', function() {
	return sass('sass/style.scss', { style: 'nested' })
	       .pipe(gulp.dest('css'));
});

gulp.task('watch',  function() {
	gulp.watch('sass/*.scss', ['styles']);
});

gulp.task('default', ['styles'], function() {
});