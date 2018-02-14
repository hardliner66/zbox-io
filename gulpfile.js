var gulp = require('gulp');
var exec = require('child_process').exec;
var minify = require('gulp-minify');
var BrowserSync = require("browser-sync");
var uiWatch = require('./semantic/tasks/watch');
var uiBuild = require('./semantic/tasks/build');

const browserSync = BrowserSync.create();

gulp.task('watch-ui', uiWatch);
gulp.task('build-ui', uiBuild);

gulp.task('hugo', function(cb) {
  exec('hugo -d ../public -s site', function(err, stdout, stderr) {
    console.log(stdout);
    if (err || stderr) {
      browserSync.notify("Hugo build failed");
      console.error(stderr);
      cb(err);
    } else {
      browserSync.reload();
      cb();
    }
  });
});

gulp.task('copy-css', function() {
  gulp
    .src('semantic/dist/semantic.min.css')
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('copy-js', function() {
  gulp
    .src('semantic/dist/semantic.min.js')
    .pipe(gulp.dest('public/js'));
  gulp
    .src('src/js/app.js')
    .pipe(minify())
    .pipe(gulp.dest('public/js/app.min.js'));
});

gulp.task('app-js', function() {
  gulp
    .src('src/js/app.js')
    .pipe(minify({
      ext: { min: '.min.js' },
      noSource: true
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('build-copy', ['build-ui'], function() {
  gulp
    .src('semantic/dist/semantic.min.css')
    .pipe(gulp.dest('public/css'));
  gulp
    .src('semantic/dist/themes/default/**/*')
    .pipe(gulp.dest('public/css/themes/default'));
  gulp
    .src('semantic/dist/semantic.min.js')
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch-js', ['copy-js'], function(cb) {
  browserSync.reload();
  cb();
});

gulp.task('watch-app-js', ['app-js'], function(cb) {
  browserSync.reload();
  cb();
});

gulp.task('build', ['build-copy', 'app-js', 'hugo'], function() {
});

gulp.task('server', ['build'], function() {
  uiWatch();

  gulp.watch('semantic/dist/semantic.min.css', ['copy-css']);
  gulp.watch('semantic/dist/semantic.min.js', ['watch-js']);
  gulp.watch('src/js/app.js', ['watch-app-js']);

  gulp.watch('site/**/*', ['hugo']);

  browserSync.init({ server: { baseDir: "public" } });
});