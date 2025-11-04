const express = require('express')
const app = express()
const userModel = require('./models/user')
const postModel = require('./models/post')
const { default: mongoose } = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/" , (req,res) => {
    res.send("welcome")
})

app.get("/create" , async(req,res) => {
    let user = await userModel.create({
        username: "aum",
        email: "maum@gmail.com",
        age: 20,
    })
    res.send(user)
})

app.get("/post/create" , async(req,res) => {
    let post = await postModel.create({
        postdata : "kese ho sab",
        user : "69083ab0bee5d286d9a1807c",
    })

    let user = await userModel.findOne({_id: "69083ab0bee5d286d9a1807c"})
    user.posts.push(post._id)
    await user.save()

    res.send({post , user})


})

app.listen(3000,() => {
    console.log("server is running...");
    
})