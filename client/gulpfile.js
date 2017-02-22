var gulp = require('gulp'),
    gif = require('gulp-if'),
    concat = require('gulp-concat'),
    resources = require('gulp-resources');
var stripCode = require('gulp-strip-code');    
var useref = require('gulp-useref'); 
    var defineOpt = function (optName, defaultValue) {
        opts[optName] = optName in opts ? opts[optName] : defaultValue;
    };

var opts = opts || {};
    defineOpt('js', false);
    defineOpt('css', true);
    defineOpt('less', false);
    defineOpt('favicon', false);
    defineOpt('src', false);
    defineOpt('skipNotExistingFiles', false);
    defineOpt('appendQueryToPath', false);

gulp.task('_default', function () {
    return gulp.src('./index.html')
        .pipe(resources(opts))
        .pipe(gif('**/*.js', concat('concat.js')))
        .pipe(gif('**/*.css', concat('concat.css')))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('strip', function () {

gulp.src(['./index.html']) 
    .pipe(stripCode({
      start_comment: "start-test-block",
      end_comment: "end-test-block"
    }))
    .pipe(gulp.dest('./tmp/file.txt'));
});


gulp.task('default', function () {
    return gulp.src('./index.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist/'));
});