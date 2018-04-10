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

	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/main.js', ['babel']).on('change', browserSync.reload);
	gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
	return gulp.src('src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});

gulp.task('babel', function() {
	return gulp.src('src/main.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);