var gulp    = require('gulp'),
    sass    = require('gulp-ruby-sass'),
    sitemap = require('gulp-sitemap'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('styles', function() {
	return sass('src/sass/', { style: 'nested' })
	       .pipe(gulp.dest('public/css'));
});

gulp.task('sitemap', function () {
	return gulp.src('public/*.html')
	       .pipe(sitemap({
	        	siteUrl: 'http://smallmoves.club'
	        }))
           .pipe(gulp.dest('./public'));
});

gulp.task('vendor', function() {
	return gulp.src(['src/js/vendor/jquery.min.js', 'src/js/vendor/jquery.dropotron.min.js',
		             'src/js/vendor/jquery.scrolly.min.js', 'src/js/vendor/jquery.scrollgress.min.js', 
		             'src/js/vendor/skel.min.js', 'src/js/vendor/skel-layers.min.js'])
	       .pipe(concat('vendor.min.js'))
	       .pipe(gulp.dest('public/js'));
});

gulp.task('minify', function() {
	return gulp.src('src/js/*.js')
	       .pipe(uglify())
	       .pipe(concat('twenty.min.js'))
	       .pipe(gulp.dest('public/js/'));
});

gulp.task('watch',  function() {
	gulp.watch('src/js/*.js', ['minify']);
	gulp.watch('src/sass/*.scss', ['styles']);
	gulp.watch('public/*.html', ['sitemap']);
});

gulp.task('default', ['styles', 'sitemap'], function() {
});

gulp.task('build', ['vendor', 'minify', 'styles'], function() {

});