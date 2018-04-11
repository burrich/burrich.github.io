const gulp         = require('gulp');
const sass         = require('gulp-sass');
const babel        = require('gulp-babel');
const rename       = require('gulp-rename');
const uglify       = require('gulp-uglify');
const cleanCSS     = require('gulp-clean-css');
const sourcemaps   = require('gulp-sourcemaps');
const runSequence  = require('run-sequence');
const autoprefixer = require('gulp-autoprefixer');

const browserSync  = require('browser-sync').create();

gulp.task('serve', ['css', 'js'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 3100
	});

	gulp.watch('src/sass/**/*.scss', ['css']).on('change', browserSync.reload);
	gulp.watch('src/main.js', ['js']).on('change', browserSync.reload);
	gulp.watch('index.html').on('change', browserSync.reload);
});

// TODO: use rename() object argument => .pipe(rename({ extname: '.js' })

// TODO: browsersync refresh only on dev AND not on serve
gulp.task('css', function() {
	return gulp.src('src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
		// .pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp.src('src/main.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
});

// TODO: external sourcemaps
gulp.task('min:css', function() {
	return gulp.src('style.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('./'));

		// .pipe(sourcemaps.init())
		// .pipe(cleanCSS({compatibility: 'ie8'}))
		// .pipe(sourcemaps.write())
});

// TODO: pump (error handling)
gulp.task('min:js', function() {
	return gulp.src('main.js')
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('copy', ['copy:css', 'copy:js', 'copy:img'], function() {
	return gulp.src(['index.html', 'cv.pdf'])
		.pipe(gulp.dest('dist_toRemove'));
});

// TODO: copy: refacto (DRY)
// TODO: remove min files ?

gulp.task('copy:css', function() {
	return gulp.src('style.min.css')
		.pipe(rename('style.css'))
		.pipe(gulp.dest('dist_toRemove'));
});

gulp.task('copy:js', function() {
	return gulp.src('main.min.js')
		.pipe(rename('main.js'))
		.pipe(gulp.dest('dist_toRemove'));
});

gulp.task('copy:img', function() {
	return gulp.src('img/*')
		.pipe(gulp.dest('dist_toRemove/img'));
});

// TODO: min css depend on variable env ?
gulp.task('deploy', function() {
	runSequence(
		['css', 'js'],
		['min:css', 'min:js'],
		'copy'
	);
});

gulp.task('default', ['serve']);