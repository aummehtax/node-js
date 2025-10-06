const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname , "/public" ))) //ye line keh rahi he ki sari static file dhundana na /public folder me


app.get("/" , (req , res) => {
    fs.readdir("./files" , (err , data) => {
         res.render("index" , {files : data} )
    })
}) 

app.get("/file/:filename"  , (req , res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf8" , (err , data) => {
        res.render("show" , {fileName : req.params.filename , fileData : data})
    })
})

app.get("/edit/:filename" , (req ,res) => {
    res.render("edit" , {prevName : req.params.filename})
})

app.get("/delete/:filename",  (req , res) => {
    
   fs.rm(`./files/${req.params.filename}` , (err)=> {
     res.redirect("/")
   })
   
})

app.post("/edit" , (req , res) => {
    fs.rename(`./files/${req.body.previous}` , `./files/${req.body.new}` , () => {
        res.redirect("/")
    })
})


app.post("/create" , (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` , req.body.description ,(err) => {
        res.redirect("/")
    })
})



 


app.listen(3000 , () => {
    console.log("server is running..");
})