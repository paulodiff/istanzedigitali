var gulp = require('gulp'),
    gif = require('gulp-if'),
    concat = require('gulp-concat'),
    resources = require('gulp-resources'),
    gulpif = require('gulp-if');
var stripCode = require('gulp-strip-code'); 
var uglify = require('gulp-uglify');
var useref = require('gulp-useref'); 
var minifyCss = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var rename = require("gulp-rename");
var del = require('del');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var inlineAngularTemplates = require('gulp-inline-angular-templates');
var jslint = require('gulp-jslint-simple');

/*

    Genera la versione ottimizzata dell'applicazione

    gulp buil:dist

*/


var defineOpt = function (optName, defaultValue) {
        opts[optName] = optName in opts ? opts[optName] : defaultValue;
};

/*
var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css');
*/

var opts = opts || {};
    defineOpt('js', false);
    defineOpt('css', true);
    defineOpt('less', false);
    defineOpt('favicon', false);
    defineOpt('src', false);
    defineOpt('skipNotExistingFiles', false);
    defineOpt('appendQueryToPath', false);

    function createErrorHandler(name) {
        return function (err) {
        console.error('Error from ' + name + ' in compress task', err.toString());
        };
    }

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


 
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});




// crea la distribuzione ottimizzata
gulp.task('dist__', function () {

    function createErrorHandler(name) {
        return function (err) {
        console.error('Error from ' + name + ' in compress task', err.toString());
        };
    }

    console.log('userref');

    gulp.src('./index.html')
        .pipe(useref())
        //.pipe(gulpif('*.js', uglify()))
        //.on('error', createErrorHandler('uglify'))
        .pipe(gulpif('*.css', minifyCss()))
        .on('error', createErrorHandler('css'))
        .pipe(gulp.dest('./dist/'))
        .on('error', createErrorHandler('gulp.dest'));

    console.log('templates');

    gulp.src('./templates/*.html')
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .on('error', createErrorHandler('htmlmin'))
        .pipe(gulp.dest('./dist/templates/'));

    console.log('images');

    gulp.src('./images/*.*')
        .pipe(gulp.dest('./dist/images/'));

    console.log('index.html remove comment to index2.html');

    // rename file ...
    gulp.src("./dist/index.html")
    .pipe(rename("index2.html"))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/goodbye.md

    console.log('overwrite index.html');
    gulp.src("./dist/index2.html")
    .pipe(gulp.dest("./dist")); 

    // remove index2.html


    /*
    gulp.src('./dist/index.html',{base: './'})
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .on('error', createErrorHandler('htmlmin'))
        .pipe(gulp.dest('./dist/demo'));
    */
   

    return true;

});

gulp.task('userefIndex', function () {
 return  gulp.src('./index.html')
        .pipe(useref())
        //.pipe(gulpif('*.js', uglify()))
        //.on('error', createErrorHandler('uglify'))
        .pipe(gulpif('*.css', minifyCss()))
        .on('error', createErrorHandler('css'))
        .pipe(gulp.dest('./dist/'))
        .on('error', createErrorHandler('gulp.dest'));

});

// minimizza tutti i templates
gulp.task('htmlminTemplates', function () {
  return gulp.src('./templates/*.html')
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .on('error', createErrorHandler('htmlmin'))
        .pipe(gulp.dest('./dist/templates/'));
});

/* copia le immagini ... */
gulp.task('copyImages', function () {
  return gulp.src('./images/*.*')
        .pipe(gulp.dest('./dist/images/'));
});


gulp.task('htmlminIndex', function () {
  return  gulp.src("./dist/index.html")
                .pipe(rename("index2.html"))
                .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
                .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/goodbye.md
});

gulp.task('patchCSSItaWoff',function () {
    return gulp.src("./ita-web-toolkit/src/icons/ita/font/fonts/ita.ttf")
      .pipe(gulp.dest("./dist/css/src/icons/ita/font/fonts")); 
  });

gulp.task('overwriteIndex', function () {
  return gulp.src("./dist/index2.html")
    .pipe(rename("index.html"))
    .pipe(gulp.dest("./dist")); 
});


gulp.task('clean', function () {
  console.log('clean dist folder..');
  return del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/**/*',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});

gulp.task('default', function () {
  console.log('########################### Use gulp build:dist ################################');
});

var optTemplateCache = {         
        root: "templates/",
        standalone: true,
        // ,base: __dirname + "/public",
        module: "myApp.templates"
        //filename: "templates.js"
};

gulp.task('build:templateCache', function () {
  return gulp.src('./dist/templates/*.html')
    .pipe(templateCache(optTemplateCache))
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function () {
    gulp.src('./scripts/*.js')
        .pipe(jslint.run({
            // project-wide JSLint options
            node: true,
            vars: true
        }))
        .pipe(jslint.report({
            // example of using a JSHint reporter
            reporter: require('jshint-stylish').reporter
        }));
});

gulp.task('build:dist', function(callback) {
  runSequence('clean',
              'copyImages', 
              'userefIndex', 
              'htmlminTemplates',
              'htmlminIndex',
              'build:templateCache',
              'patchCSSItaWoff',
              'overwriteIndex',
              callback);
});

/*
gulp.task('build:dist', [
                            'clean',
                            'copyImages',
                            'userefIndex',
                            'htmlminTemplates',
                            'htmlminIndex'
                        ]);
*/