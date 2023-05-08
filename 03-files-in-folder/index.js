const { join, parse } = require("path");
const { readdir, stat } = require("fs");
const dir = join(__dirname, "secret-folder");

function byteRound (syze) {
  if(syze < 2**10) return syze + 'B'
  if(syze < 2**20) return (syze / 2**10).toFixed(2) + 'KB'
  if(syze < 2**30) return (syze / 2**20).toFixed(2) + 'MB'
  if(syze < 2**40) return (syze / 2**30).toFixed(2) + 'GB'
  return (syze / 2**40).toFixed(2) + 'TB'
}

readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile()){
      stat(join(dir, file.name), { throwIfNoEntry: false }, (err, stats)=>{
        if (err) throw err;     
        console.log(`- ${parse(file.name).name}-${parse(file.name).ext.substring(1)}-${byteRound(stats.size)}`);
      });
    }
  })
})