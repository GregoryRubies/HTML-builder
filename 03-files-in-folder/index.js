const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "secret-folder");

function byteRound (syze) {
  if(syze < 2**10) return syze + 'B'
  if(syze < 2**20) return (syze / 2**10).toFixed(2) + 'KB'
  if(syze < 2**30) return (syze / 2**20).toFixed(2) + 'MB'
  if(syze < 2**40) return (syze / 2**30).toFixed(2) + 'GB'
  return (syze / 2**40).toFixed(2) + 'TB'
}

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile()){
      fs.stat(path.join(dir, file.name), { throwIfNoEntry: false }, (err, stats)=>{
        if (err) throw err;     
        console.log(`- ${path.parse(file.name).name}-${path.parse(file.name).ext.substring(1)}-${byteRound(stats.size)}`);
      });
    }
  })
})