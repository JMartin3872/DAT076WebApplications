import express, { Router, Request, Response } from "express";
import { LoginService } from "../service/login";
import { Login } from "../model/login";
import { Diary } from "../model/diary";

const loginService: LoginService = new LoginService();

export const loginRouter : Router = express.Router();

interface UserRequest extends Request {
    body: { username: string, password: string },
    session: any
}


loginRouter.get("/", async (
    req: Request, res: Response) => {
    const list = await loginService.getLogin();
    res.status(201).send(list);
}
)

//Router for registering a new user
loginRouter.post("/register", async (
    req: Request<{}, string, { username: string; password: string }>, res: Response<string>
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
    catch (e: any) {
        res.status(500).send(e.message);
    }
}
)


//Router for a user trying to login
loginRouter.post("/", async (
        req :UserRequest,
        res: Response<Diary[] | string>
    )=> {
        try {
            if (req.session.username === req.body.username){
                delete req.session.username   //If the user is already logged in, log out and log in as this user
            }
            const loginResult: Diary[] | undefined = await loginService.tryLogin(req.body.username, req.body.password)
            if (loginResult === undefined) {
                res.status(401).send("Wrong credentials");
            } else {
                req.session.username = req.body.username //Give the session to the user
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

    req: Request<{}, string, { username: string; oldPassword: string; newPassword: string }>,
    res: Response<string>) => {
    try {
        const changePassword: Login | undefined
            = await loginService.changePassword(req.body.username, req.body.oldPassword, req.body.newPassword);
        if (changePassword === undefined) {
            res.status(401).send("Wrong credentials");
        } else {
            res.status(201).send("success!")
        }
    }
    catch (e: any) {
        res.status(500).send(e.message);
    }
}
)