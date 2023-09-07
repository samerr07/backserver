const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");

dotenv.config()
const server = express();
// const port = 8080;
const corsOptions = {
  origin:true,
  credentials:true,
}


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://codersam:oAehfbswfH9OfkiW@cluster0.sjry8oj.mongodb.net/?retryWrites=true&w=majority");

  console.log("Database connected successfully");
}


server.use(express.json())
server.use(cookieParser())
server.use(cors(corsOptions))
server.use("/api/v1/auth",authRouter.router)

server.get("/",(req,res)=>{
    
  res.send("Hello World")
})


server.listen(8080,()=>{
    console.log("Server Started");
})