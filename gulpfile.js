const gulp        = require('gulp');
const sass        = require('gulp-sass');
const babel       = require('gulp-babel');
const rename      = require('gulp-rename');
const sourcemaps  = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

gulp.task('serve', ['sass', 'babel'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 3100
	});

	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch('main.js', ['babel']).on('change', browserSync.reload);
	gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
	return gulp.src('sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});

gulp.task('babel', function() {
	return gulp.src('src/main.js')
		.pipe(babel())
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);