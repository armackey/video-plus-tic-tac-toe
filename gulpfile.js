var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var reload = browserSync.reload;

// or...

gulp.task('sync', function() {
    browserSync.init({
        files: ['**/*.*'],
        files: ['**/**'],
        proxy:  'http://localhost:5000',
        port: 3000
    });
    gulp.watch(['./client/index.html', './client/index.css', './client/**/**.js'], {cwd: 'app'}, reload);
});

gulp.task('server', function(){
  nodemon({
    script: './server/server.js',
  })
});

gulp.task('default', 
  ['server', 'sync']);