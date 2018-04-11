const gulp       = require('gulp');
const sass       = require('gulp-sass');
const babel      = require('gulp-babel');
const rename     = require('gulp-rename');
const uglify     = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const runSequence = require('run-sequence');

//  PostCSS
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const uncss        = require('postcss-uncss');
const cssnano      = require('cssnano');

const browserSync = require('browser-sync').create();


const browserSyncPort = 3100;

const paths = {
	dev: './',
	prod: 'dist_toRemove',
	src: 'src',
	maps: 'maps'
};

// TODO: use rename() object argument => .pipe(rename({ extname: '.js' })
// TODO: environment variable
// TOD0: change tasks names (dist to suffix ?) => build:css

gulp.task('default', ['serve']);

gulp.task('serve', ['css', 'js'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: browserSyncPort
	});

	gulp.watch(paths.src + '/sass/**/*.scss', ['css']).on('change', browserSync.reload);
	gulp.watch(paths.src + '/main.js', ['js']).on('change', browserSync.reload);
	gulp.watch('index.html').on('change', browserSync.reload);
});

// CSS

gulp.task('css', function() {
	return gulp.src('src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(sourcemaps.write(paths.maps))
		.pipe(gulp.dest(paths.dev));
});

gulp.task('dist:css', function() {
	return gulp.src('src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(postcss([
			autoprefixer(),
			uncss({ html: ['index.html'] }),
			cssnano({ preset: 'default' })
		]))
		.pipe(sourcemaps.write(paths.maps))
		.pipe(gulp.dest(paths.prod));
});

// JS

gulp.task('js', function() {
	return gulp.src('src/main.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write(paths.maps))
		.pipe(gulp.dest(paths.dev));
});

// TODO: pump (error handling) => see uglify doc
gulp.task('dist:js', function() {
	return gulp.src('src/main.js')
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(uglify())
	.pipe(sourcemaps.write(paths.maps))
	.pipe(gulp.dest(paths.prod));
});

// Copy

gulp.task('copy', ['copy:img'], function() {
	return gulp.src(['index.html', 'cv.pdf'])
		.pipe(gulp.dest(paths.prod));
});

gulp.task('copy:img', function() {
	return gulp.src('img/*')
		.pipe(gulp.dest(paths.prod + '/img'));
});

// Build

gulp.task('build', ['css', 'js']);

gulp.task('dist:build', function() {
	runSequence(
		['dist:css', 'dist:js'],
		'copy'
	);
});