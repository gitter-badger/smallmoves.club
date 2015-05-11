var gulp    = require('gulp'),
    sass    = require('gulp-ruby-sass'),
    sitemap = require('gulp-sitemap');

gulp.task('styles', function() {
	return sass('sass/style.scss', { style: 'nested' })
	       .pipe(gulp.dest('css'));
});

gulp.task('sitemap', function () {
	return gulp.src('index.html')
	       .pipe(sitemap({
	        	siteUrl: 'http://smallmoves.club'
	        }))
           .pipe(gulp.dest('./'));
});

gulp.task('watch',  function() {
	gulp.watch('sass/*.scss', ['styles']);
});

gulp.task('default', ['styles'], function() {
});