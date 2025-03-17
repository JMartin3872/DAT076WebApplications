import express, { Router, Request, Response } from "express";
import { LoginService } from "../service/login";
import { Login } from "../model/login";
import { Diary } from "../model/diary";

const loginService: LoginService = new LoginService();

export const loginRouter : Router = express.Router();

//The interface to be used in session related endpoints.
interface UserRequest extends Request {
    body: { username: string, password: string },
    session: any
}

//Router for registering a new user
loginRouter.post("/register", async (
    req: Request<{}, string, { username: string; password: string }>, res: Response<string>
) => {
    try {
        if (typeof (req.body.password) !== "string" || typeof (req.body.username) !== "string") {   //Check the formatting
            res.status(400).send(`username and password Need to be strings, password type: ${typeof (req.body.password)} 
        username type: ${typeof (req.body.username)}`);
        } else {
            await loginService.registerUser(req.body.username, req.body.password);  //If correct format, register the user

            res.status(201).send("Created!");
        }
    }
    catch (e: any) {
        res.status(500).send(e.message);
    }
}
)


//Router for a user trying to login.
loginRouter.post("/", async (
        req :UserRequest,
        res: Response<Diary[] | string>
    )=> {
        try {
            if (typeof (req.body.password) !== "string" || typeof (req.body.username) !== "string") {  //Check the formatting
                res.status(400).send(`username and password Need to be strings, password type: ${typeof (req.body.password)} 
        username type: ${typeof (req.body.username)}`);
            } else {
                if (req.session.username === req.body.username) {
                    delete req.session.username   //If the user is already logged in, log out and log in as this user
                }
                const loginResult: Diary[] | undefined = await loginService.tryLogin(req.body.username, req.body.password)  //See if the credentials are correct
                if (loginResult === undefined) {
                    res.status(401).send("Wrong credentials");
                } else {
                    req.session.username = req.body.username    //Give the session to the user who just succeeded to log in.
                    res.status(200).send(loginResult);
                }
            }
        }
        catch(e:any){
            res.status(500).send(e.message);
        }
    }
)


//To change the password of a user.
loginRouter.patch("/changepassword", async (
    req: Request<{}, string, { username: string; oldPassword: string; newPassword: string }>,
    res: Response<string>) => {
    try {
        if (typeof (req.body.oldPassword) !== "string" || typeof (req.body.username) !== "string" ||
            typeof (req.body.newPassword) !== "string") {       //Check the formatting
            res.status(400).send(`username and password Need to be strings, oldPassword type: ${typeof (req.body.oldPassword)} 
        username type: ${typeof (req.body.username)}`);
        } else {
            const changePassword: Login | undefined
                = await loginService.changePassword(req.body.username, req.body.oldPassword, req.body.newPassword);     //Change the password
            if (changePassword === undefined) {
                res.status(401).send("Wrong  ");
            } else {
                res.status(201).send("success!")
            }
        }
    }
    catch (e: any) {
        res.status(500).send(e.message);
    }
}
)

// Let user log out from app.
loginRouter.post("/logout", (
    req: Request, 
    res: Response) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send("Error logging out");
            } else {
                res.status(200).send("Logged out successfully");
            }
        });
    } else {
        res.status(400).send("No active session");
    }
});

loginRouter.post("/deleteuser", async (
    req: UserRequest, res: Response
) => {
    try {
        if (req.session.username === req.body.username) {
            delete req.session.username   //If the user is already logged in, log out and log in as this user
        }
        const result: string | undefined = await loginService.deleteUser(req.body.username, req.body.password)      //Delete the username and password-
        if (!result) {                                                                                              //As well as diaries connected to this account.
            res.status(401).send("Wrong credentials");
        } else {
            res.status(200).send("User deleted!");
        }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});