const express = require('express')
const path = require('path')
const userModel = require('./models/user')

const app = express()

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname , "public")))


app.get("/" , (req , res) => {
    res.render("index")
    
})

app.get("/read" , async (req , res) => {
    let userData = await userModel.find()
    res.render("read" , {userData})
})

app.get("/delete/:id" , async(req , res) => {
    let userDeleted = await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect("/read")
})

app.get("/edit/:userid" , async(req , res) => {
    let userUpd = await userModel.findOne({_id : req.params.userid})
    res.render("edit" , {userUpd})
})


app.post("/create" , async(req , res) => {

    let {name , email , images} = req.body

    let userCreate = await userModel.create({
        name : name,
        email : email,
        images : images,
    })
    
    res.redirect("/read")
    
})

app.post("/update/:userid" , async(req , res) => {

    let {name , email , images} = req.body
    
    let userUpdated = await userModel.findOneAndUpdate({_id : req.params.userid} ,  {name , email , images} , {new:true}) // with new:true // Returns the UPDATED version
    res.redirect("/read")
    
})


app.listen(3000 , () => {
    console.log("server is running..");
    
})