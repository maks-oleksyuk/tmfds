import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import less from 'gulp-less';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';
import merge from 'merge-stream';
import autoPrefixer from 'gulp-autoprefixer';
import gcmq from 'gulp-group-css-media-queries';
import gulpStylelint from 'gulp-stylelint';

// import cleanCss from 'gulp-clean-css'
const sass = gulpSass(dartSass);

/**
 * * * * * * * * * * * * Config * * * * * * * * * * * *
 */
const src = './styles';
const dist = './dist';
const media = './media'
const config = {
  src: src,
  dist: {
    root: dist,
    css: `${dist}/css/**/*.css`,
    js: `${dist}/js/**/*.js`,
    media: `${dist}/media/**/*`
  },
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
export const clean = () => deleteAsync(config.dist.root);

// Static Server
export const server = (callback) => {
  browserSync.create().init({
    // Use url your site
    proxy: 'http://test.docksal.site',
    port: 8080,
    files: [
      config.dist.css,
      config.dist.js,
      {
        match: `${config.dist.media}/**/*`,
        fn() {
          this.reload();
        },
      },
    ],
    notify: false,
    open: false,
  })
  callback();
}

export const watch = () => gulp.watch([config.styles.scss, config.styles.less], styles);

export const styles = () => {
  let s = gulp.src(config.styles.scss)
    .pipe(sass())
    .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

  let l = gulp.src(config.styles.less)
    .pipe(less())
    .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

  return merge(s, l)
    .pipe(gcmq())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream());
}

let build2 = gulp.series(clean, styles);

export const build = gulp.parallel(build2, watch, server)

