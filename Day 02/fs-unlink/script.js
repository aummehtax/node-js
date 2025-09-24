//  * fs.unlink(path, callback) → Deletes a file asynchronously.
//  * Always handle errors in the callback.

const fs = require('fs')

fs.unlink("index.html" , (err) => {
    if(err) console.log(err.message);
    else console.log("file removed");
    
} )