// converts browserify stream into vinyl file stream req. for gulp
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Gulp – compile & minify files, run server, watch for changes
var gulp = require('gulp');
var gutil = require('gulp-util');                     // better error messages
var stylus = require('gulp-stylus');                  // compile .styl files to CSS
var autoprefixer = require('gulp-autoprefixer');      // auto-prefix CSS
var imagemin = require('gulp-imagemin');              // compress images
var cache = require('gulp-cache');                    // compress only new images
var notify = require('gulp-notify');                  // notify of errors

var del = require('del');                             // delete unneeded files from build

var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')


/*
  Styles Task
*/

gulp.task('styles',function() {
  // move over fonts
  gulp.src('css/fonts/**.*')
    .pipe(gulp.dest('build/css/fonts'))

  // Compiles CSS
  gulp.src('css/style.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/css/'))
    .pipe(reload({stream:true}))
});

/*
  Images
*/
gulp.task('images',function(){
  gulp.src('images/**')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./build/images/'))
});

/*
  Resources
*/
gulp.task('resources',function(){
  gulp.src('resources/**')
    .pipe(gulp.dest('./build/resources/'))
});

/*
  Clean Build
*/
gulp.task('clean', function() {
    return del(['build/*.js', 'build/css/*.css', 'build/images/**.*']);
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({stage : 0 })]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['images','styles','scripts','resources','clean','browser-sync'], function() {
  gulp.watch('css/**/*', ['styles']); // gulp watch for stylus changes
  return buildScript('main.js', true); // browserify watch for JS changes
});
