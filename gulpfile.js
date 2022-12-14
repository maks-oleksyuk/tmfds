import gulp from 'gulp';
import less from 'gulp-less';
import gcmq from 'gulp-group-css-media-queries';
import merge from 'merge-stream';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob'
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import autoPrefixer from 'gulp-autoprefixer';
import {deleteAsync} from 'del';
import gulpStylelint from '@ronilaukkarinen/gulp-stylelint';

/**
 * * * * * * * * * * * * * * Config * * * * * * * * * * * * * *
 */
const sass = gulpSass(dartSass);

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
    root: src,
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
 * * * * * * * * * * * * * * Tasks * * * * * * * * * * * * * *
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
    .pipe(gulpStylelint({
      failAfterError: false,
      fix: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
    .pipe(gulp.dest(config.styles.root))
    .pipe(sassGlob())
    .pipe(sass({includePaths: ['./node_modules']}))
    .pipe(autoPrefixer())

  let l = gulp.src(config.styles.less)
    .pipe(gulpStylelint({
      failAfterError: false,
      fix: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
    .pipe(gulp.dest(config.styles.root))
    .pipe(sassGlob())
    .pipe(less({includePaths: ['./node_modules']}))
    .pipe(autoPrefixer())

  return merge(s, l)
    .pipe(gcmq())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream());
}

export const scss = () => {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({includePaths: ['./node_modules']}))
    .pipe(gulpStylelint({
      failAfterError: false,
      fix: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
    .pipe(autoPrefixer())
    .pipe(gcmq())
    .pipe(gulp.dest('./css'));
}


let build2 = gulp.series(clean, styles);

export const build = gulp.parallel(build2, watch, server)
