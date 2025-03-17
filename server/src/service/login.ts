import {Login} from "../model/login";
import { Diary } from "../model/diary";
import {diaryService} from "../router/diary";
import bcrypt from "bcrypt";
import {LoginModel} from "../../db/login.db";



export class LoginService{


    //Register a user with username and password, and also use-
    // Bcrypt to hash the password before saving it in the database.
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
        return newUser;
    }


    // The function to return list of diaries and check the hashed password
    async tryLogin(username : string,password : string) : Promise<Diary[] | undefined>{
       let user : Login | null = await LoginModel.findOne({ where: {username}})     //Find the username in the database
        if(!user){
            return undefined;
        }
       if(await bcrypt.compare(password, user.password)){
            return diaryService.getListOfDiaries(username);     //If correct, return the list of diaries
        }

    }
    //Change the password of an account.
    async changePassword(username : string,oldPassword : string,newPassword : string) : Promise<Login | undefined>{
        let user : Login | null = await LoginModel.findOne({ where: {username}})       //Find the username in the database
        if(!user){
            return undefined;
        }
        if(await bcrypt.compare(oldPassword, user.password)){
            const salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(newPassword,salt)
            await LoginModel.update({       //Update the exciting password to the newly hashed password.
                    password: hashedPassword
                },
                {where: {username : username}})
            //Make a new login object to return later.

            let updatedUser : Login = {
                username : username,
                password : hashedPassword
            }
            return updatedUser;
        }

    }
    //Delete user account as well as delete all corresponding diaries that the user have has made.
    async deleteUser(username : string,password : string) : Promise<string| undefined> {
        let user: Login | null = await LoginModel.findOne({where: {username}})
        if (!user) {
            return undefined;
        }
        if (await bcrypt.compare(password, user.password)) {
            await diaryService.deleteAllUserDiariesAndEntries(username)     //First delete all diaries from the database
            await LoginModel.destroy({where: {username}})     //Lastly delete the username and password itself from the database
            return "ok"
        }
        else {
            return undefined;
        }

    }





}