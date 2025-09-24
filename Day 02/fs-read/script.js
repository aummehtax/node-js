// fs.readFile() -> Asynchronously reads the content of a file
// Syntax: fs.readFile(path, [encoding], callback)
// - path: file location (e.g. "hello.txt")
// - encoding (optional): if given (e.g. "utf8"), returns text instead of Buffer
// - callback: function with (err, data)
//      err  -> error object if something goes wrong
//      data -> file content (Buffer by default, string if encoding is set)

// Encoding = the way data is converted between human-readable text and computer-readable bytes (0s & 1s).

const fs = require('fs')

fs.readFile("hello.txt" ,  "utf8" , (err , data) => {
    if(err) console.log(err.message);
    else console.log(data); 
    
} )