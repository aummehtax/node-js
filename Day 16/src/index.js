// method 2
import dotenv from 'dotenv'
import connectDB from "./db/database.js";
import { app } from './app.js';

dotenv.config({ path: "./.env" })

connectDB() //it return promise so chain .then() and .catch() on it.
.then(() => {
    app.on("error" , (error) => {
        console.log("error : " , error);
    })
    app.listen(process.env.PORT , () => {
        console.log(`server is running on port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log(`mongoDB connection is failed !` , error);
})



// method 1
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"
const app = express()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGOD_URI}/${DB_NAME}`)

    app.on("error" , (error)=>{
        console.log("error : ",error);
        throw error
    })   

    app.listen(process.env.PORT , () => {
        console.log(`app is listening on port : ${process.env.PORT}`);
    })
     
} catch (error) {
    console.log("error : ",error); 
    throw error  
}
})()*/
