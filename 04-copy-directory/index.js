const { join } = require('node:path');
const { copyFile, mkdir, rm, readdir } = require('node:fs/promises');

const curfolder = join(__dirname, "files");
const newFolder = join(__dirname, "files-copy");

/**
 * 
 * копирует содержимое папки **files** в папку **files-copy**
 * 
 */

async function copyDir() {
  try {
    const files = await readdir(curfolder, { withFileTypes: true });
    await rm(newFolder, { recursive: true, force: true });
    await mkdir(newFolder, { recursive: true, force: true });
    files.forEach(file => {
      if(file.isFile()){
        copyFile(join(curfolder, file.name), join(newFolder, file.name));
      }
    })
  } catch {
    console.log("что-то пошло не так");
  }
}

copyDir()