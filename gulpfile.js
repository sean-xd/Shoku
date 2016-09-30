// Dev Dependencies
var gulp = require("gulp"),
  concat = require("gulp-concat"),
  flatten = require("gulp-flatten"),
  babel = require("gulp-babel"),
  minify = require("gulp-minify"),
  sass = require('gulp-ruby-sass'),
  eslint = require('gulp-eslint'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require("gulp-clean-css"),
  browserSync = require("browser-sync"),
  nodemon = require("gulp-nodemon");

// Files
var src = {
    html: "src/index.html",
    partials: "src/partials/*.html",
    sass: ["src/styles/fonts.sass", "src/styles/classes.sass", "src/styles/reset.sass", "src/styles/*.sass", "src/styles/mediaQueries.sass"],
    css: "src/temp/build.sass",
    js: "src/scripts/*.js"
  },
  dest = {public: "public/", partials: "public/partials/", sass: "src/temp/"};

// Build Tasks
gulp.task("html", () => {
  return gulp.src(src.html)
    .pipe(gulp.dest(dest.public));
});

gulp.task("partials", () => {
  return gulp.src(src.partials)
    .pipe(flatten())
    .pipe(gulp.dest(dest.partials));
});

gulp.task("sass", () => {
  return gulp.src(src.sass)
    .pipe(concat("build.sass"))
    .pipe(gulp.dest(dest.sass));
});

gulp.task("css", ["sass"], () => {
  return sass(src.css)
    .pipe(autoprefixer({browsers: ["last 2 versions"]}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dest.public));
});

gulp.task("js", () => {
  return gulp.src(src.js)
    .pipe(concat("app.js"))
    .pipe(babel({presets: ["es2015"]}))
    .pipe(gulp.dest(dest.public));
});

gulp.task("default", ["html", "partials", "js", "css"]);

// Dev Tasks
gulp.task("nodemon", cb => {
  var started = false;
  return nodemon({script: "server.js", watch: ["server.js", "db/*.js"]}).on("start", () => {
    if(!started) cb();
    started = true;
  });
});

gulp.task("browser-sync", ["nodemon"], () => {
	browserSync.init(null, {
		proxy: "http://localhost:4259",
    files: ["public/**/*.*"],
    browser: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    port: 3000,
	});
});

gulp.task("dev", ["default", "browser-sync"], () => {
  gulp.watch(src.html, ["html"]);
  gulp.watch(src.partials, ["partials"]);
  gulp.watch(src.js, ["js"]);
  gulp.watch(src.sass, ["css"]);
});
