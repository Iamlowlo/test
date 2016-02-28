var gulp = require('gulp'),
	scss = require('gulp-sass'),
	coffee = require('gulp-coffee'),
	handlebars = require('gulp-compile-handlebars'),
	grename = require('gulp-rename'),
	livereload = require('gulp-server-livereload'),
	gutil = require('gulp-util');

gulp.task('scss-compile',function(){
	gulp.src('app/scss/*.scss')
		.pipe(scss())
		.pipe(gulp.dest('build/css'));
});

gulp.task('coffee-compile',function(){
	gulp.src('app/coffee/*.coffee')
		.pipe(coffee({bare:true}).on('error',gutil.log))
		.pipe(gulp.dest('build/scripts'));
});

gulp.task('hbs-compile',function(){
	var templateData= {
			test: 'test'
		},
		hbsOptions = {
			ignorePartials : true,
			batch : ['./app/views/partials'],
			helpers : {
			}
		};
	gulp.src('app/views/*.hbs')
		.pipe(handlebars(templateData,hbsOptions))
		.pipe(grename(function(path){path.extname='.html'}))
		.pipe(gulp.dest('build'));
});

gulp.task('watch',function(){
	gulp.watch('app/scss/**/*.scss',['scss-compile']);
	gulp.watch('app/coffee/**/*.coffee',['coffee-compile']);
	gulp.watch('app/views/**/*.hbs',['hbs-compile']);
	gulp.src('build')
		.pipe(livereload({
			livereload:true,
			deafultFile:'build/index.html',
			open:true
		}))
});

gulp.task('default',function(){
});