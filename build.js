const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");

const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");

const ensureDistDir = () => {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
};

const copyStaticFile = (fileName) => {
  fs.copyFileSync(path.join(rootDir, fileName), path.join(distDir, fileName));
};

const build = async () => {
  ensureDistDir();

  await esbuild.build({
    entryPoints: [path.join(rootDir, "app.js")],
    bundle: true,
    format: "esm",
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    outfile: path.join(distDir, "app.js"),
  });

  copyStaticFile("index.html");
  copyStaticFile("styles.css");

  console.log("Built static site in dist/");
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
