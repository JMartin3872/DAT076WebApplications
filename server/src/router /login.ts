import express, { Router, Request, Response } from "express";
import {LoginService} from "../service/login";

const loginService : LoginService = new LoginService();

const loginRouter : Router = express.Router();

loginRouter.post("/register", async (
    req : Request<>, res: Response)
)