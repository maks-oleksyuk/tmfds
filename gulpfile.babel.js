import gulp from 'gulp';
// import dartSass from 'sass';
// import gulpSass from 'gulp-sass';
// import less from 'gulp-less';
import del from 'del';
import browserSync from 'browser-sync';
// import merge from 'merge-stream';
// import autoPrefixer from 'gulp-autoprefixer';
// import gcmq from 'gulp-group-css-media-queries';
// import cleanCss from 'gulp-clean-css'
// const sass = gulpSass(dartSass);

/**
 * * * * * * * * * * * * Config * * * * * * * * * * * *
 */
const src = './styles';
const dist = './dist';
const media = './media'
const config = {
  src: src,
  dist: dist,
  media: media,
  styles: {
    scss: `${src}/**/*.scss`,
    less: `${src}/**/*.less`,
    dest: `${dist}/css/`
  },
  setEnv() {
    this.isProd = process.argv.includes('--prod');
    this.isDev = !this.isProd;
  }
}
config.setEnv();

/**
 * * * * * * * * * * * * Tasks * * * * * * * * * * * *
 */

// Clean destination directory
export const clean = () => del(config.dist);

// Static Server
export const server = (callback) => {
  browserSync.create().init({
    // Use url your site
    proxy: 'http://test.docksal.site',
    notify: false,
    open: false,
  })
  callback();
}

export const build = gulp.series(
  clean,
)

export const watch = gulp.series(
  build,
  server,
)

// function styles() {
//   let s = gulp.src(paths.styles.scss)
//     .pipe(sass())
//     .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

//   let l = gulp.src(paths.styles.less)
//     .pipe(less())
//     .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

//   return merge(s, l)
//     .pipe(gcmq())
//     .pipe(gulp.dest(paths.styles.dest))
// }
