const express = require("express")

const app = express()

app.get("/" , (req,res) => {
    res.send("home page")
})

app.get("/profile" , (req,res) => {
    res.send("profile page")
})

app.get("/blog" , (req,res) => {
    res.send("blog page")
})

app.listen(3000 , () => {
   console.log("chal gaya code..");
})