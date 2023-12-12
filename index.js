const express = require ('express')
const connectToMongo = require('./db/db')
const dotenv = require('dotenv')
const userRouter = require ('./routes/user')
const authRouter = require ('./routes/auth')
const productRouter = require ('./routes/product')
const cartRouter = require ('./routes/cart')
const orderRouter = require ('./routes/order')
const cors = require("cors");
const app = express()
dotenv.config()
connectToMongo()
app.use(cors());
app.use(express.json())
app.use("/api/users",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/carts",cartRouter)
app.listen(process.env.PORT ||5000,()=>{
    console.log(`backend server is running ${process.env.PORT|| 5000}`);
})