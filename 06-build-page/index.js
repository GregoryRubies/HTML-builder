const { join, parse } = require("node:path");
const { EOL } = require("node:os");
const { readFile, writeFile, readdir, rm, mkdir, copyFile } = require("node:fs/promises");
const { createReadStream, createWriteStream } = require("node:fs");

const template = readFile(join(__dirname, "template.html"), { encoding: 'utf8' });
const components = readdir(join(__dirname, "components"), { withFileTypes: true });
const bundleDir = join(__dirname, "project-dist/style.css");
const stylesDir = join(__dirname, "styles");
const newFolder = join(__dirname, "project-dist");
const curfolder = join(__dirname, "assets");
const copyFolder = join(newFolder, "assets");

async function copyDir(curfolder, copyFolder) {
  try {
    const files = await readdir(curfolder, { withFileTypes: true });
    await rm(copyFolder, { recursive: true, force: true });
    await mkdir(copyFolder, { recursive: true, force: true });
    files.forEach(async file => {
      if(file.isFile()){
        await copyFile(join(curfolder, file.name), join(copyFolder, file.name));
      } else if (file.isDirectory){
        copyDir(join(curfolder, file.name), join(copyFolder, file.name));
      }
    })
  } catch {
    console.log("что-то пошло не так");
  }
}

async function getHTML(){

  let t = await template;
  let f = await components;

  for(const component of f.filter(component => component.isFile() && parse(component.name).ext === '.html')){
    t = t.replaceAll(
      `{{${parse(component.name).name}}}`, 
      await readFile(join(__dirname, "components", component.name), { encoding: 'utf8' })
    );
  }
  
  return t;
}

async function getCSS() {
  const writeStream = createWriteStream(bundleDir);
  const files = await readdir(stylesDir, { withFileTypes: true });
  writeStream.write(`/* Сборка css */${EOL}${EOL}`);
  files
    .filter(file => file.isFile() && parse(file.name).ext === '.css')
    .sort(file => file.name)
    .forEach(async (file) => {
      const readStream = createReadStream(join(stylesDir, file.name), 'utf-8');
      readStream.on('data', chunk => writeStream.write(`${chunk}${EOL}`));
    })
}

rm(newFolder, { recursive: true, force: true })
  .then(() => 
    mkdir(newFolder, { recursive: true, force: true })
      .then(
        async () => {
          await writeFile(join(newFolder, "index.html"), await getHTML());
          await getCSS();
          await copyDir(curfolder, copyFolder);
        }
      )
  );
