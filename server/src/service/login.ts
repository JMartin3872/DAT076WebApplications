import {Login} from "../model/login";
import { Diary } from "../model/diary";
import {diaryService} from "../router/diary";
import bcrypt from "bcrypt";

export class LoginService{

    private loginIds : Login[] = []
    async getLogin() : Promise<Login[]> {
        return this.loginIds;
    }



    async registerUser(username : string, password : string) : Promise<Login>{
        //Use a token to encrypt the password
       const salt = bcrypt.genSaltSync(10);
        let newUser : Login = {
            username : username,
            password : bcrypt.hashSync(password,salt)
        }
        this.loginIds.push(newUser);
        return newUser;
    }


    // A method to return list of diaries and check the hashed password
    async tryLogin(username : string,password : string) : Promise<Diary[] | undefined>{
        let user : Login | undefined = this.loginIds.find(
            login => login.username === username && bcrypt.compare(password,login.password))
       if (user === undefined){
           return undefined;
       }
       else {
           return diaryService.getListOfDiaries(username);
       }
    }

    async changePassword(username : string,oldPassword : string,newPassword : string) : Promise<Login | undefined>{
        let user : Login | undefined = this.loginIds.find(
            login => login.username === username && login.password === oldPassword)
        if (user === undefined){
            return undefined;
        }
        else {
            let updatedUser : Login = {
                username : username,
                password : newPassword
            }
            this.loginIds = this.loginIds.filter(login => login.username != username);
            this.loginIds.push(updatedUser);
            return updatedUser;
        }
    }







}