//how to set cookie & read cookie
//install : npm i cookie-parser


const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

app.use(cookieParser())

app.get("/" , (req , res) => {
    res.cookie("name" , "aum") //set cookie

    //we can write expire date/second also
    // res.cookie("name" , "aum" ,{
    //     // method : 1
    //         // maxAge : 5000   //expire after 5 second
    //     // method : 2
    //         // expires : new Date(Date.now() + 10000)
    // })
    
    
    res.send("done")
})

app.get("/read" , (req , res) => {

    console.log(req.cookies); //cookies coming from browser to server 
    res.send("done")
})


app.listen(3000 , () => {
    console.log("server is running");
    
})