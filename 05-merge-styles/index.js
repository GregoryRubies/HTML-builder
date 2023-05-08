const { join, parse } = require("node:path");
const { EOL } = require("node:os");
const { readdir } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");

const stylesDir = join(__dirname, "styles");
const bundleDir = join(__dirname, "project-dist/bundle.css");
const writeStream = createWriteStream(bundleDir);

/**
 * Сборка css бандла
 */
async function createBundle() {
  const files = await readdir(stylesDir, { withFileTypes: true });
  writeStream.write(`/* Сборка css бандла */${EOL}${EOL}`);
  files
    .filter(file => file.isFile() && parse(file.name).ext === '.css')
    .sort(file => file.name)
    .forEach(async (file) => {
      const readStream = createReadStream(join(stylesDir, file.name), 'utf-8');
      readStream.on('data', chunk => writeStream.write(`${chunk}${EOL}`));
    })
}

createBundle()