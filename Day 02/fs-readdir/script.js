// fs.readdir(path, callback) -> reads folder, gives array of file/folder names
// Option: { withFileTypes: true } -> returns Dirent objects (check file/dir)

const fs = require('fs')

fs.readdir("./copy"  ,(err , files) => {
    if(err) console.log(err);
    else console.log(files);
    
    
})

// { withFileTypes: true }

// fs.readdir("./copy" , {withFileTypes:true} , (err , files) => {
//     if(err) { console.log(err); }
//     else {
//             files.forEach((files) => {
//                console.log(files.name , files.isDirectory()? "dir" : "file");

//             })
//     }
// })