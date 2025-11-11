const express = require('express')
const app = express()
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12 , (err , bytes) => {
        const fn = bytes.toString("hex") + path.extname(file.originalname)
        cb(null, fn)
    })
  }
})

const upload = multer({ storage: storage })

app.get("/" , (req , res) => {
    res.render("multer")
})

app.post("/upload", upload.single("image") , (req , res) => {
    console.log(req.file);
    
})


app.listen(8080 , () => {
    console.log("server is running..");
})