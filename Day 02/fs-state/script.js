// fs.stat(path, cb) -> get info about file/dir, use isFile() / isDirectory() to check type

const fs = require('fs')

fs.stat("./copy" , (err , stat) => {
    if(err) console.log(err);
    else { 
        console.log(stat);
        console.log("creation date/time",stat.birthtime);
        console.log("size", stat.size);
        console.log("Modified at", stat.mtime);
    }
    
    
})