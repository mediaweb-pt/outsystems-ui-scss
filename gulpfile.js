// Load plugins

const browsersync = require("browser-sync").create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require("del");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');


// BrowserSync

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./"
      },
      port: 3000,
      startPath: './index.html'
    });
    done();
  }

// BrowserSync reload

function browserSyncReload(done) {
    browsersync.reload();
    done();
  }


// Clean vendor
function clean() {
    return del(["./vendor/", "./css/"]);
  }



// SCSS to CSS compilator

function style(){
  
    // 1. Define the input file (scss)
    return gulp.src('./scss/*.scss')

    // 2. Pass it through sass compiler with map
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    
    // 3. Add auto prefixes
    .pipe(autoprefixer({
        browserslistrc: ['last 3 versions', 'ie >= 10', '> 5%'],
        cascade: false
      })
    )
    
    // 4. Save the compiled CSS
    .pipe(sourcemaps.write('./maps'))
    .pipe(
      gulp.dest('./css')
    )
}

// Watching the changes on files

function watchFiles() {
    gulp.watch("./**/*.css", browserSyncReload);
    gulp.watch("./**/*.html", browserSyncReload);
    gulp.watch('./scss/',style);
  }
  

// Defining the tasks
const vendor = gulp.series(clean);
const build = gulp.series(vendor);
const watch = gulp.series(build ,gulp.parallel(watchFiles, browserSync,style));

// Exporting the tasks 

exports.style = style;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = watch;