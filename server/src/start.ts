import express from "express";
import {loginRouter} from "./router/login";

export const app = express();

app.use(express.json());
app.use("/login", loginRouter);