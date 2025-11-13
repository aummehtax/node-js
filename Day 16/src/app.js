import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" //to access cookie from user browser
import path from "path"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    optionsSuccessStatus : 200, 
}))
app.use(express.json()) //we can give limit also like how much json we can accept {limit : '50mb'}
app.use(express.urlencoded({extended:true})) //you can set limit in this also
app.use(express.static("/public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)  //look like this http://localhost:8000/users/register

export {app}