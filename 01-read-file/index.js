const path = require("path");
const fs = require("fs");
const {stdout} = process;
const stream = new fs.ReadStream(path.join(__dirname, "text.txt"), {encoding: "utf-8"});

/*
fs.readFile(
  path.join(__dirname, 'text.txt'),
  'utf-8',
  (err, data) => {
      if (err) throw err;
      stdout.write(data);
  }
);
*/

stream.on('readable', () => {
  let data = stream.read();
  if(data != null) stdout.write(data);
});