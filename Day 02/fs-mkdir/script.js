// fs.mkdir(path, {recursive:true}, callback) -> create dir, recursive = true allows nested dirs

const fs = require('fs')

fs.mkdir("./copy" , (err) => {
    if(err) console.log(err);
    else console.log("add dir");
    
    
})

//if parent doesn’t exist, it will create both parent and child.

// fs.mkdir("./parent/child" , {recursive:true} , (err) => {
//     if(err) console.log(err);
//     else console.log("add dir");
    
    
// })