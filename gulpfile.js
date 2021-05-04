// 'use strict';
const gulp = require("gulp");
const sass = require("gulp-ruby-sass"); //require('gulp-sass');
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const uglify = require("gulp-uglify");
const filter = require("gulp-filter");
const jshint = require("gulp-jshint");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const babel = require("gulp-babel");

const DEBUG = false;
const scss_base = "./src/assets/scss/base.scss";
const scss_modules = "./src/assets/scss/modules/**/*.scss";
const scss_pages = "./src/assets/scss/pages/**/*.scss";
const scss_theme = "./src/assets/scss/theme/**/*.scss";
const js_root = "./src/assets/js/**/*.js";
const html_root = "./src/**/*.html";
const asset_css = "./src/assets/css";
const asset_css_pages = "./src/assets/css/pages";
const asset_css_theme = "./src/assets/css/theme";
const asset_css_fonts = "./src/assets/css/fonts";

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  // gulp.watch(scss_base, ['basesass']);
  // gulp.watch(scss_modules, ['basesass']);
  // gulp.watch(scss_pages, ['pagesass']);
  // gulp.watch(scss_theme, ['themesass']);
  gulp.watch(html_root).on("change", reload);
});

//生成基础的css
gulp.task("basesass", function() {
  return sass(scss_base, {
    style: "compressed",
    sourcemap: DEBUG ? true : false
  })
    .on("error", sass.logError)
    .pipe(
      sourcemaps.write("maps", {
        includeContent: false,
        sourceRoot: "source"
      })
    )
    .pipe(gulp.dest(asset_css))
    .pipe(filter("**/*.css"))
    .pipe(browserSync.reload({ stream: true }));
});
//生成各页面的css
gulp.task("pagesass", function() {
  return sass(scss_pages, {
    style: "compressed",
    sourcemap: DEBUG ? true : false
  })
    .on("error", sass.logError)
    .pipe(
      sourcemaps.write("maps", {
        includeContent: false,
        sourceRoot: "source"
      })
    )
    .pipe(gulp.dest(asset_css_pages))
    .pipe(filter("**/*.css"))
    .pipe(browserSync.reload({ stream: true }));
});
//生成各主题的css
gulp.task("themesass", function() {
  return sass(scss_theme, {
    style: "compressed",
    sourcemap: DEBUG ? true : false
  })
    .on("error", sass.logError)
    .pipe(
      sourcemaps.write("maps", {
        includeContent: false,
        sourceRoot: "source"
      })
    )
    .pipe(gulp.dest(asset_css_theme))
    .pipe(filter("**/*.css"))
    .pipe(browserSync.reload({ stream: true }));
});

//发布时压缩代码,压缩src里的代码到dist并更换版本号，发布时发布dist里的代码
const runSequence = require("gulp4-run-sequence"); //保证串发运行
const gulpif = require("gulp-if");
const imagemin = require("gulp-imagemin");
const minifyHtml = require("gulp-minify-html");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const del = require("del");
const rename = require("gulp-rename");

const jsSrc = "src/assets/js/**/*.js";
const jsRev = "src/assets/js/rev";
const jsDest = "dist/assets/js";
const cssSrc = "src/assets/css/**/*.css";
const cssRev = "src/assets/css/rev";
const cssDest = "dist/assets/css";
const imageSrc = "src/assets/img/**/*";
const imageDest = "dist/assets/img";
const condition = true;
//清理cssRev
gulp.task("cleanRev", function() {
  return del([cssRev, jsRev]);
});

//压缩image
gulp.task("minImages", function() {
  return (
    gulp
      .src(imageSrc)
      //.pipe(imagemin())
      .pipe(rev())
      .pipe(gulp.dest(imageDest))
      .pipe(rev.manifest())
      .pipe(gulp.dest("src/assets/rev/img"))
  );
});

//将图片版本号更新到css
gulp.task("updateImageRevToCss", function() {
  return gulp
    .src(["src/assets/rev/img/*.json", cssSrc])
    .pipe(revCollector())
    .pipe(gulp.dest(cssRev));
});

//更换css的版本号
gulp.task("cssVersion", function() {
  return (
    gulp
      .src(cssRev + "/**/*.css")
      .pipe(revCollector())
      //.pipe(gulpif(condition,minifyCss()))
      .pipe(rev())
      .pipe(gulp.dest(cssDest))
      // .pipe(rev.manifest())
      .pipe(gulp.dest("src/assets/rev/css"))
  );
});

//将图片版本号更新到Js
gulp.task("updateImageRevToJs", function() {
  return gulp
    .src(["src/assets/rev/img/*.json", jsSrc])
    .pipe(revCollector())
    .pipe(gulp.dest(jsRev));
});

//压缩JS
gulp.task("miniJS", function() {
  return gulp
    .src(jsRev + "/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default")) // 对代码进行报错提示
    .pipe(babel())
    .pipe(gulpif(condition, uglify()))
    .pipe(rev())
    .pipe(gulp.dest(jsDest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("src/assets/rev/js"));
});

//压缩html/更新引入文件版本
gulp.task("miniHtml", function() {
  return gulp
    .src(["src/assets/rev/**/*.json", "src/**/*.html"])
    .pipe(revCollector())
    .pipe(
      gulpif(
        condition,
        minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })
      )
    )
    .pipe(gulp.dest("dist"));
});

//移动json格式数据到dist
gulp.task("movePluginsJson", function() {
  return gulp
    .src("src/assets/js/plugins/**/*.json")
    .pipe(gulp.dest("dist/assets/js/plugins"));
});

//移动js里css文件到dist
gulp.task("movePluginsCss", function() {
  return gulp
    .src("src/assets/js/plugins/**/*.css")
    .pipe(gulp.dest("dist/assets/js/plugins"));
});

//移动fonts文件到dist
gulp.task("movefonts", function() {
  return gulp
    .src("src/assets/css/font-awesome-4.7.0/fonts/**/*")
    .pipe(gulp.dest("dist/assets/css/font-awesome-4.7.0/fonts"));
});
//开发构建
gulp.task("dist", function(done) {
  runSequence(
    ["basesass"],
    ["pagesass"],
    ["themesass"],
    ["cleanRev"],
    ["minImages"],
    ["updateImageRevToCss"],
    ["cssVersion"],
    ["updateImageRevToJs"],
    ["miniJS"],
    ["miniHtml"],
    ["movePluginsJson"],
    ["movePluginsCss"],
    ["movefonts"],
    done
  );
});
