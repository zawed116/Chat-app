import express from "express";
import dotenv, { config } from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import userRoutes from "./routes/user.route.js"

import connectTomongo from "../db/connectTomongo.js";
import cookieParser from "cookie-parser";
// import { Socket } from "socket.io";
import { app,server } from "./socket/socket.js";



export default server



// const app = express();


const PORT = process.env.PORT || 5000;

dotenv.config();
// app.get('/' , (req ,res)=>{
//   res.send("HELLO");
// });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use("/api/messages",  messageRoutes)
app.use("/api/users",  userRoutes);

server.listen(PORT, () => {
  connectTomongo();
  console.log(`server runnning at port ${PORT}`);
  });
 