const path = require("path");
const fs = require("fs");
const {stdin, stdout, exit} = process;
const dir = path.join(__dirname, 'text.txt');

stdout.write("Привет!\nДалее вам предлагается ввести произвольный текст.\nДля завершения нажмите ctrl + c или введите exit.\n\nВведите текст: ");

stdin.on("data", data => {
  let text = data.toString();
  if(text.trim() == "exit"){
    stdout.write("Ввод завершен.");
    exit();
  } else {
    fs.access(dir, err => {
      if (err) {
        fs.writeFile(dir, text, err => { if (err) throw err; });
      } else {
        fs.appendFile(dir, text, err => { if (err) throw err; });
      }
    });

    stdout.write("->");
  }
});

process.on('SIGINT', () => {
  stdout.write("\nВвод завершен.");
  exit();
});
