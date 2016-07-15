var gulp = require("gulp"),
  concat = require("gulp-concat"),
  flatten = require("gulp-flatten"),
  src = {
    html: "src/index.html",
    partials: ["src/components/**/*.html"],
    css: ["src/css/*.css", "src/components/**/*.css"],
    js: ["src/js/*.js", "src/components/**/*.js"]
  },
  dest = {html: "public/", partials: "public/partials/", css: "public/", js: "public/"};

gulp.task("html", () => gulp.src(src.html).pipe(gulp.dest(dest.html)));
gulp.task("partials", () => gulp.src(src.partials).pipe(flatten()).pipe(gulp.dest(dest.partials)));
gulp.task("css", () => gulp.src(src.css).pipe(concat("main.css")).pipe(gulp.dest(dest.css)));
gulp.task("js", () => gulp.src(src.js).pipe(concat("app.js")).pipe(gulp.dest(dest.js)));

gulp.task("default", ["html", "partials", "js", "css"]);
gulp.task("watch", ["default"], () => {
  gulp.watch(src.html, ["html"]);
  gulp.watch(src.partials, ["partials"]);
  gulp.watch(src.js, ["js"]);
  gulp.watch(src.css, ["css"]);
});
