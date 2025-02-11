import express from "express";
import {loginRouter} from "./router/login";
import { diaryRouter } from "./router/diary";

export const app = express();

app.use(express.json());
app.use("/diary", diaryRouter)
app.use("/login", loginRouter);