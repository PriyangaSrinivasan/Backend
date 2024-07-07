import express from "express";
import cors from "cors";
import connectDB from "./Database/Config.js";
import dotenv from "dotenv";
import authRoute from "./Routers/authRoute.js";
import userRoute from "./Routers/userRoute.js";
import postRoute from './Routers/postRoute.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin:'*',
  credentials:true
}));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

connectDB();

app.get('/',(req,res)=>{
  res.status(200).send(`<h1 style="background-color:lightpink;padding:10px 0px;text-align:center">Blog-Diary</h1>`)
})

app.use("/api/auth", authRoute);
app.use("/api/user",userRoute);
app.use("/api/post",postRoute)

app.listen(process.env.PORT, () => {
  console.log(`server is running on port`);
});
