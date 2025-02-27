import express from "express";
import { loginRouter } from "./router/login";
import { diaryRouter } from "./router/diary";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();


export const app = express();

app.use(express.json());

if (!process.env.SESSION_SECRET) {
    console.log("Could not find SESSION_SECRET in .env file");
    process.exit();
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors({
    origin: true,
    credentials: true
}));
app.use("/diary", diaryRouter)
app.use("/login", loginRouter);