import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" //to access cookie from user browser

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    optionsSuccessStatus : 200, 
}))
app.use(express.json()) //we can give limit also like how much json we can accept {limit : '50mb'}
app.use(express.urlencoded({extended:true})) //you can set limit in this also
app.use(express.static("public"))
app.use(cookieParser())

export {app}