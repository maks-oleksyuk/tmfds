import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import less from 'gulp-less';
import { deleteAsync } from 'del';
import * as path from 'path'
import browserSync from 'browser-sync';
import merge from 'merge-stream';
import autoPrefixer from 'gulp-autoprefixer';
import gcmq from 'gulp-group-css-media-queries';
import cleanCss from 'gulp-clean-css'


const sass = gulpSass(dartSass);
const src = './styles';
const dist = './dist';
const media = '/media'
const root = path.basename(path.resolve());

const paths = {
  build: {},
  watch: {},
  styles: {
    scss: src + '/**/*.scss',
    less: src + '/**/*.less',
    dest: dist + '/css/'
  },
  src: src,
  dist: dist,
  root: root,
  media: media,
}

const clean = () => {
  return deleteAsync(paths.dist);
}

// Static Server + watching scss/less/js files
function server() {
  browserSync.init({
    proxy: 'http://test.docksal.site',
  })
}

function styles() {
  let s = gulp.src(paths.styles.scss)
    .pipe(sass())
    .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

  let l = gulp.src(paths.styles.less)
    .pipe(less())
    .pipe(autoPrefixer({ overrideBrowserslist: ["last 5 version"], }))

  return merge(s, l)
    .pipe(gcmq())
    .pipe(gulp.dest(paths.styles.dest))
}

function defaultTask(cb) {
  // place code for your default task here
  console.log('default task')
  cb();
}

gulp.task('default', defaultTask)
gulp.task('clean', clean)
gulp.task('styles', styles)
