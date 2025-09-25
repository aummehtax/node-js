const express = require("express")

const app = express()

app.get("/" , (req ,res , next) => {
    return next(new Error("error in code"))
})   

app.use((err , req , res , next) => {
    console.log(err.stack);
    res.status(500).send("something broke bhai !")
})

app.listen(3000 , () => {
    console.log("server is running...");
})

