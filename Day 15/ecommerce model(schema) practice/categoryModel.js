import mongoose from 'mongoose'

const categoryModel = mongoose.Schema({
  name : {
    type : String,
    required : true,
    
  }

}, {timestamps :true})

export const category = mongoose.model("category" , categoryModel)