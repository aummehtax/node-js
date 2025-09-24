//  fs.rm(path, options, callback) → Removes a file or directory.
//  * - Can delete folders with `{ recursive: true }`.
//  * - Asynchronous method → handle errors in callback.

const fs = require('fs')

fs.rm("./copy" , {recursive: true}, (err) => {
    if(err) console.log(err.message);
    else console.log("folder removed");
    
    
})