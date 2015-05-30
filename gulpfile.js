var gulp    = require('gulp'),
    sass    = require('gulp-ruby-sass'),
    sitemap = require('gulp-sitemap');

gulp.task('styles', function() {
	return sass('sass/', { style: 'nested' })
	       .pipe(gulp.dest('public/css'));
});

gulp.task('sitemap', function () {
	return gulp.src('public/*.html')
	       .pipe(sitemap({
	        	siteUrl: 'http://smallmoves.club'
	        }))
           .pipe(gulp.dest('./public'));
});

gulp.task('watch',  function() {
	gulp.watch('sass/*.scss', ['styles']);
	gulp.watch('public/*.html', ['sitemap']);
});

gulp.task('default', ['styles', 'sitemap'], function() {
});