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
             login => login.username === username)
       if (user === undefined || !await bcrypt.compare(password, user.password)){
           return undefined;
       }
       else {
           return diaryService.getListOfDiaries(username);
       }
    }

    //TODO: Fix encryption
    async changePassword(username : string,oldPassword : string,newPassword : string) : Promise<Login | undefined>{
        let user : Login | undefined = this.loginIds.find(
            login => login.username === username)
        if (user === undefined || !await bcrypt.compare(oldPassword, user.password)){
            return undefined;
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            let updatedUser : Login = {
                username : username,
                password : bcrypt.hashSync(newPassword,salt)
            }
            this.loginIds = this.loginIds.filter(login => login.username != username);
            this.loginIds.push(updatedUser);
            return updatedUser;
        }
    }







}