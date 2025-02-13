import express from "express";
import {loginRouter} from "./router/login";
import { diaryRouter } from "./router/diary";
import cors from "cors";


export const app = express();

app.use(express.json());
app.use(cors());
app.use("/diary", diaryRouter)
app.use("/login", loginRouter);