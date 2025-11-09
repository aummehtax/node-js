// populate() define - In MongoDB, when you connect two collections (like user and post) using an ObjectId, MongoDB does not automatically give you the full document.
// It only gives you the ID (like a pointer).
// populate() is what tells Mongoose:
// “Hey, instead of just showing me the ObjectId, go to that other collection and bring the full document.”

const express = require('express')
const app = express()
const userModel = require("./models/user")
const postModel = require("./models/post")
const cookieParser = require("cookie-parser")
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname , 'stylesheets')))

app.get("/" , (req , res) => {
    res.render("index")
})

app.get("/login" , (req , res) => {
    res.render("login")
})

app.get("/profile" , isLoggedIn , async(req , res) => {
    let user = await userModel.findOne({email : req.user.email}).populate("posts")
    console.log(user);
    
    res.render("profile" , {user})

})

app.get("/likes/:id" , isLoggedIn , async(req , res) => {
    let post = await postModel.findOne({_id : req.params.id}).populate("user")
    
    if(post.likes.indexOf(req.user.userId) == -1){
        post.likes.push(req.user.userId)
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userId),1)
    }

    await post.save()
    res.redirect("/profile")
})

app.get("/edit/:id" , isLoggedIn , async(req , res) => {
    let post = await postModel.findOne({_id : req.params.id}).populate("user")    
    res.render("edit" , {post})
})

app.post("/update/:id" , isLoggedIn , async(req , res) => {
    console.log(req.body);
    
    let post = await postModel.findOneAndUpdate({_id : req.params.id} , {content : req.body.content})

    res.redirect("/profile")
})

app.post("/post" , isLoggedIn , async(req , res) => {
    let user = await userModel.findOne({email : req.user.email})
    let {content} = req.body

    let post = await postModel.create({
        user : user._id,
        content : content,
    })

    user.posts.push(post._id)
    await user.save()
    
    res.redirect("/profile" )
})

app.post("/register" , async(req , res) => {
    let {username,name,age,email,password} = req.body

    let user = await userModel.findOne({email})

    if(user){
        return res.status(500).send("User already registered") 
    }
    else{
        bcrypt.genSalt(10 , (err,salt) => {
            bcrypt.hash(password , salt , async(err , hash) => {

                let user = await userModel.create({
                    username,
                    name,
                    age,
                    email,
                    password : hash
                })

                let token = jwt.sign({email : email , userId : user._id} , "ssshh")
                res.cookie("token" , token)
                res.send("registered")

            })
        })    
    }
})

app.post("/login" , async(req , res) => {
    let {email,password} = req.body

    let user = await userModel.findOne({email})

    if(!user){
        return res.status(500).send("something went wrong!")
    }
    else{
        bcrypt.compare(password , user.password ,(err , result) => {
            if(result){
                let token = jwt.sign({email : email , userId : user._id} , "ssshh")
                res.cookie("token" , token)
                res.status(200).redirect("/profile")
            }
            else{
                res.redirect("/login")
            }
        })
    }
})

app.get("/logout" , (req , res) => { 
  res.cookie("token" , "")
  res.redirect("/login")
})

function isLoggedIn(req , res , next) {
    // if(req.cookies.token === ""){
    //     res.redirect("/login")
    // }
    // else{
    //     let data = jwt.verify(req.cookies.token , "ssshh")
    //     req.user = data 
    //     next()
    // }
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/login");
        }

        const data = jwt.verify(token, "ssshh");
        req.user = data;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.redirect("/login");
    }
}

app.listen(3000 , () => {
    console.log("server is running..");
})