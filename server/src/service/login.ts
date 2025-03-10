import {Login} from "../model/login";
import { Diary } from "../model/diary";
import {diaryService} from "../router/diary";
import bcrypt from "bcrypt";
import {LoginModel} from "../../db/login.db";

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
        await LoginModel.create({
            username: newUser.username,
            password: newUser.password

        })
        this.loginIds.push(newUser);
        return newUser;
    }


    // A method to return list of diaries and check the hashed password
    async tryLogin(username : string,password : string) : Promise<Diary[] | undefined>{
       let user : Login | null = await LoginModel.findOne({ where: {username}})
        if(!user){
            return undefined;
        }
       if(await bcrypt.compare(password, user.password)){
            return diaryService.getListOfDiaries(username);
        }

    }

    async changePassword(username : string,oldPassword : string,newPassword : string) : Promise<Login | undefined>{
        let user : Login | null = await LoginModel.findOne({ where: {username}})
        if(!user){
            return undefined;
        }
        if(await bcrypt.compare(oldPassword, user.password)){
            const salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(newPassword,salt)
            await LoginModel.update({
                    password: hashedPassword
                },
                {where: {username : username}})

            let updatedUser : Login = {
                username : username,
                password : hashedPassword
            }
            return updatedUser;
        }

    }







}