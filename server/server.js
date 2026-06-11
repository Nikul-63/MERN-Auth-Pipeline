import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import { authRouter } from "./Routes/authRoutes.js";
import userRouter from "./Routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// function to connect to the database
connectDB();

const allowedOrigins = ['https://mern-auth-pipeline-client.onrender.com']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server Started On Port: ${port}`));
