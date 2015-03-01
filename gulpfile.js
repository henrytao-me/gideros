var gulp = require('gulp');
var jshintStylish = require('jshint-stylish');
var plugins = require('gulp-load-plugins')();
var reporters = require('jasmine-reporters');
var runSequence = require('run-sequence');
var JasmineSpecReporter = require('jasmine-spec-reporter');

var SPECS = process.env.SPECS || null;

gulp.task('jscs', function() {
  return gulp.src(['lib/**/*.js', 'server.js'])
    .pipe(plugins['jscs']());
});

gulp.task('jshint', function() {
  return gulp.src(['lib/**/*.js', 'server.js'])
    .pipe(plugins['jshint']())
    .pipe(plugins['jshint'].reporter(jshintStylish));
});

gulp.task('test:unit', function(cb) {
  gulp.src(['lib/**/*.js', 'server.js'])
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(SPECS || ['tests/specs/**/*.spec.js'])
        .pipe(plugins.jasmine({
          reporter: [new JasmineSpecReporter({
            displayStacktrace: true
          }), new reporters.JUnitXmlReporter({
            savePath: 'tests/results/'
          })]
        }))
        .on('error', function() {
          process.exit(1);
        })
        .pipe(plugins.istanbul.writeReports({
          dir: './tests/results/coverage/'
        }))
        .on('end', cb);
    });
});

gulp.task('test', function(done) {
  runSequence.apply(null, ['jscs', 'jshint', 'test:unit', function() {
    done();
  }]);
});
