import mongoose from 'mongoose'

const orderItemSchema = mongoose.Schema({
  productId : {
    types : mongoose.Schema.Types.ObjectId,
    ref : "product"
  },
  productQuantity : {
    types : Number,
    required : true
  }

})

const orderModel = mongoose.Schema({
    orderPrice : {
      type : Number,
      required : true
    },
    stock : {
      type : Number,
      required : true
    },
    customer : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user",
      required : true
    },
    orderItem : [orderItemSchema],
    address : {
      type : String,
      required : true
    },
    status : {
      type : String,
      enum : ["PENDING" , "CANCELLED" , "DELIVERED"],
      default : "PENDING"
    }


}, {timestamps :true})

export const order = mongoose.model("order" , orderModel)