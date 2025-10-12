const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(cookieParser())

app.get("/" , (req , res) => {

    let token = jwt.sign({email : "aum@example.com"} , "secret" )
    res.cookie("token" , token)  //is cookie ke andar token he usme sara data hai (browser pe bheje)
    res.send("done")
})

app.get("/read" , (req , res) => {    
    let data = jwt.verify(req.cookies.token ,"secret") // browser(user) se data(req) aa gaya abhi decryption karte hai
    console.log(data); // see data 
    
})


app.listen(3900 , () => {
    console.log("server is running");
    
})