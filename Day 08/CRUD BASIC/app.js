const express = require('express')

const app = express()

const userModel = require('./usermodel')

app.get("/" , (req,res) => {
    res.send("hey")
})

app.get("/create" , async(req,res) => {
   let createUser = await userModel.create({
        name: "binod",
        userName: "binod006",
        email: "binod53@gmail.com"
    })

    res.send(createUser)
})

app.get("/read" , async(req,res) => {
   let readUser = await userModel.find()
    res.send(readUser)
})

app.get("/update" , async(req,res) => {
   let updateUser = await userModel.findOneAndUpdate({userName:"binod006"} , {name:"binod009"} , {new:true}) //new true se updated user milega
    res.send(updateUser) 
})

app.get("/delete" , async(req,res) => {
   let deleteUser = await userModel.findOneAndDelete({userName:"binod006"}) 
    res.send(deleteUser) 
})

app.listen(3000 , () => {
    console.log("server is running");
})