var gulp = require('gulp');
var exec = require('child_process').exec;
var uiWatch = require('./semantic/tasks/watch');
var uiBuild = require('./semantic/tasks/build');

gulp.task('watch-ui', uiWatch);
gulp.task('build-ui', uiBuild);

gulp.task('hugo', function(cb) {
  exec('hugo -d ../public -s site', function(err, stdout, stderr) {
    if (err) return cb(err);
    console.log(stdout);
    if (stderr) console.log(stderr);
    cb();
  });
});

gulp.task('copy-ui', function() {
  gulp.src('semantic/dist/semantic.min.css').pipe(gulp.dest('public/css'));
  gulp.src('semantic/dist/semantic.min.js').pipe(gulp.dest('public/js'));
});

gulp.task('build', ['build-ui', 'hugo'], function() {
  gulp.start(["copy-ui"]);
});

gulp.task('server', function() {
  uiWatch();

  gulp.watch('semantic/dist/semantic.min.@(css|js)', function(event) {
    gulp.start(["copy-ui"]);
  });

  gulp.watch('site/**/*', function() {
    gulp.start(["hugo"]);
  });
});

