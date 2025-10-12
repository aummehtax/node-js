//bcrypt : encryption(Hashing) & decryption(compare)
//for more info visit npm website

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// thisismypassword
//hash -> $2b$10$kQ0DENt6zKkqdWM.3jnK2OdPBOTbMvY6VfgJroY2j56VStSOlPvCW  (encrypted this (thisismypassword))

app.get("/" , (req , res) => {
    
    //encryption(Hashing)
    // bcrypt.genSalt(10 , (err , salt) => { //salt is random string
    //     bcrypt.hash("thisismypassword" , salt , (err , hash) => {
    //         console.log(hash); //in here you can store hash in database
    //     })
    // })

    //decryption(compare)
    bcrypt.compare("thisismypassword" , "$2b$10$kQ0DENt6zKkqdWM.3jnK2OdPBOTbMvY6VfgJroY2j56VStSOlPvCW", (err , result) => {
        console.log(result); //if both password and hash match than give true else false
    })

    res.send("working")

})


app.listen(3600 , () => {
    console.log("server is running");
    
})