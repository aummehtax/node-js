// app.use() middleware runs before routes.

const express = require("express")

const app = express()

app.use((req , res , next) => {
    console.log("middleware haylu ho bhai");
    next() //pass control to next middleware or route
    
})

app.use((req , res , next) => {
    console.log("middleware haylu ho bhai 2 varr");
    next() 
    
})

app.use((req , res , next) => {
    console.log("middleware haylu ho bhai 3 varr");
    next() 
    
})

app.get("/" , (req , res) => {
    res.send("hello bhai")
})

app.get("/profile" , (req , res) => {
    res.send("profile page")
})

app.listen(8080 , () => {
    console.log("server chalu thay gayu bhai...");
})