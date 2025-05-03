import gulp from "gulp";
import shell from "gulp-shell";
import { rimraf } from "rimraf";

//clean function from rimraf
gulp.task("clean", async () => {
  await rimraf("dist");
});

// clean dist folder before build with parcel
gulp.task(
  "build",
  gulp.series("cleanr", shell.task("parcel build index.html "))
);
