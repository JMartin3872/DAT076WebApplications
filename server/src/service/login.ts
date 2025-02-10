import {Login} from "../model/login";

export class LoginService{

    private loginIds : Login[] = [];

    async getLogin() : Promise<Login[]> {
        return this.loginIds;
    }



    async registerUser(username : string, password : string) : Promise<Login>{
        let newUser : Login = {
            username : username,
            password : password
        }
        this.loginIds.push(newUser);
        return newUser;
    }

/*
    //TODO: A method to return list of diaries!
    async tryLogin(username : string,password : string) : Promise<listOfDiaries | undefined>{
        let user : Login | undefined = this.loginIds.find(
            login => login.username === username && login.password === password)
        return user ? getListOfDairies(user) : undefined;
    }

 */

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