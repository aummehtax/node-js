const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017')

const userSchema = mongoose.Schema({
    name: "string",
    userName: "string",
    email: "string",
})

module.exports = mongoose.model('user' , userSchema)  //it pluralization like if user than it will be users