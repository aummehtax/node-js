import mongoose from 'mongoose'

const productModel = mongoose.Schema({
  
  image : {
    type : String,
    required : true
  },
  title : {
    type : String,
    required : true
  },
  category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "category",
    required : true ,
  },
  detail : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true ,
    default : 0
  },
  quantity : {
    type : Number,
    default : 0
  },
  productOwner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
  }





}, {timestamps :true})

export const product = mongoose.model("product" , productModel)