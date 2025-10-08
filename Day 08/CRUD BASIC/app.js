const express = require('express')

const app = express()

const userModel = require('./usermodel')

app.get("/" , (req,res) => {
    res.send("hey")
})

app.get("/create" , async(req,res) => {
   let createUser = await userModel.create({
        name: "harshita",
        userName: "harshita02",
        email: "harshita53@gmail.com"
    })

    res.send(createUser)
})

app.get("/read" , async(req,res) => {
   let readUser = await userModel.find()
    res.send(readUser)
})

app.get("/update" , async(req,res) => {
   let updateUser = await userModel.findOneAndUpdate({userName:"harshita02"} , {userName:"harshita9898" , name:"harshita ben" , email:"harshita222@gmail.com"} , {new:true}) //new true se updated user milega
    res.send(updateUser) 
})

app.get("/delete" , async(req,res) => {
   let deleteUser = await userModel.findOneAndDelete({userName:"aum0099"}) 
    res.send(deleteUser) 
})

app.listen(3000 , () => {
    console.log("server is running");
})