const { join } = require("node:path");
const { access, writeFile, appendFile, constants } = require("node:fs/promises");
const { stdin, stdout, exit } = process;

const dir = join(__dirname, 'text.txt');

(async function (dir) {
  await access(dir, constants.R_OK)
    .then(() => appendFile(dir, ''))
    .catch(() => writeFile(dir, ''));
})(dir)

stdout.write("Привет!\nДалее вам предлагается ввести произвольный текст.\nДля завершения нажмите ctrl + c или введите exit.\n\nВведите текст: ");

stdin.on("data", async data => {
  let text = data.toString();
  if(text.trim() == "exit"){
    stdout.write("Ввод завершен.");
    exit();
  } else {
    await appendFile(dir, text);
    stdout.write("->");
  }
});

process.on('SIGINT', () => {
  stdout.write("\nВвод завершен.");
  exit();
});
