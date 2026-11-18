import express from 'express'
import { connectDB } from './config/db.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import studentProfile from './routes/studentRoute.js'
const app=express();
app.use(express.json());
const corsOption={
    origin:"*",
}
app.use(cors(corsOption));
app.use(cookieParser());
app.use("/api/auth",userRoute);
app.use("/api/admin",adminRoute);
app.use("/api/profile",studentProfile)
app.listen(8080,()=>{
    connectDB();
    console.log('server is running on port 8080');
})