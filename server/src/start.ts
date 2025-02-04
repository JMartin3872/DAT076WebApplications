import express from "express";
//OBS uncomment this immport and add path to your router file as in the lab-instructions.
//import { taskRouter } from "./router/task";

export const app = express();

app.use(express.json());
//Also uncomment this line when you have fixed imports
//app.use("/task", taskRouter);