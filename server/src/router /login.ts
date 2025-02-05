import express, { Router, Request, Response } from "express";
import {LoginService} from "../service/login";
import {Login} from "../model/login";

const loginService : LoginService = new LoginService();

const loginRouter : Router = express.Router();

loginRouter.post("/register", async (
    req : Request<{},string,{username : string; password : string}>, res: Response<string>
    ) => {
    if (typeof (req.body.password) !== "string" || typeof (req.body.username) !== "string"){
        res.status(400).send(`username and password Need to be strings, password type: ${typeof (req.body.password)} 
        username type: ${typeof (req.body.username)}`);
    }
    else {
       await loginService.registerUser(req.body.username,req.body.password);
       res.status(201).send("Created!");
    }})

loginRouter.post("/login", async (
    req : Request<{},listOfDiaries,{username : string; password : string}>, res: Response<listOfDiaries>
    )=> {
    const loginResult : listOfDiaries | undefined = await loginService.tryLogin(req.body.username,req.body.password)
    if (loginResult === undefined) {
        res.status(401).send("wrong credentials");
    }
    else {
        res.status(201).send(loginResult);
    }})



