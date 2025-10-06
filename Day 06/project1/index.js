const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname , "/public")))
app.set('view engine' , 'ejs') //to render ejs pages

app.get("/" , (req , res) => {
    res.render("index")
})

app.get("/profile/:username" , (req , res) => {  //by giving this : you create dynamic routing
    res.send(`welcome ${req.params.username}`)  //req.params means aesa kuch bhi jiske aage colon : hai
})

app.get("/author/:username/:age" , (req , res) => {  
    res.send(`welcome ${req.params.username} ${req.params.age}`)  
})

app.listen(3000 , () => {
    console.log("server is running");
    
}) 