import express, { Router, Request, Response } from "express";
import {LoginService} from "../service/login";
import {Login} from "../model/login";
import {Diary} from "../model/diary";

const loginService : LoginService = new LoginService();

export const loginRouter : Router = express.Router();

loginRouter.get("/", async (
        req : Request, res : Response) => {
        const list = await loginService.getLogin();
        res.status(201).send(list);
    }
)

//Router for registering a new user
loginRouter.post("/register", async (
        req : Request<{},string,{username : string; password : string}>, res: Response<string>
    ) => {
        try {
            if (typeof (req.body.password) !== "string" || typeof (req.body.username) !== "string") {
                res.status(400).send(`username and password Need to be strings, password type: ${typeof (req.body.password)} 
        username type: ${typeof (req.body.username)}`);
            } else {
                await loginService.registerUser(req.body.username, req.body.password);

                res.status(201).send("Created!");
            }
        }
        catch (e : any) {
            res.status(500).send(e.message);
        }
    }
)

//TODO: Fix request session as well!
//Router for a user trying to login
loginRouter.post("/", async (
        req : Request<{},Diary[] | string,{username : string; password : string}>,
        res: Response<Diary[] | string>
    )=> {
        try {
            const loginResult: Diary[] | undefined = await loginService.tryLogin(req.body.username, req.body.password)
            if (loginResult === undefined) {
                res.status(401).send("Wrong credentials");
            } else {
                //  (req as any).session.username = req.body.username;
                res.status(200).send(loginResult);

            }
        }
        catch(e:any){
            res.status(500).send(e.message);
        }
    }
)


//To change password of a user
loginRouter.patch("/changepassword", async (

        req : Request<{}, string, {username : string; oldPassword : string; newPassword : string}>,
        res : Response<string>) => {
        try {
            const changePassword: Login | undefined
                = await loginService.changePassword(req.body.username, req.body.oldPassword, req.body.newPassword);
            if (changePassword === undefined) {
                res.status(401).send("Wrong credentials");
            } else {
                res.status(201).send("success!")
            }
        }
        catch (e:any) {
            res.status(500).send(e.message);
        }
    }
)