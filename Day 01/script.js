/**
 * -> Node.js File System (fs) Module - Quick Notes
 * 
 * - fs.writeFile(path, data, callback) → Creates a file OR overwrites existing file.
 * - fs.appendFile(path, data, callback) → Appends data to a file (creates if not exist).
 * - fs.rename(oldPath, newPath, callback) → Renames or moves a file.
 * - fs.copyFile(src, dest, callback) → Copies content of one file to another.
 * 
 * -> These are asynchronous methods → they don’t run in strict order.
 *    Always handle errors inside callbacks.
 */

const fs = require('fs')

fs.writeFile("hello.txt" , "kem cho", (err) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log("writeFile done");
        
    }
})


fs.appendFile("hello.txt" , " badha maja ma ne mota", (err) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log("append done");
        
    }
})

fs.rename("hello.txt" , "hey.txt" , (err) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log("rename done");
        
    }
})

fs.copyFile("hey.txt" , "./copy/copy.txt" , (err) => {
    if (err) {
        console.log(err.message);
    }
    else{
        console.log("copyFile done");
        
    }
})


