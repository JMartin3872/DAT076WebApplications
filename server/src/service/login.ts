import {Login} from "../model/login";
export class LoginService{

    private loginIds : Login[] = [];



    async registerUser(username : string, password : string) : Promise<Login>{
        let newUser : Login = {
            username : username,
            password : password
        }
        this.loginIds.push(newUser);
        return newUser;
    }


    //TODO: A method to return list of diaries!
    async tryLogin(username : string,password : string) : Promise<listOfDiaries | undefined>{
        let user : Login | undefined = this.loginIds.find(
            login => login.username === username && login.password === password)
        return user ? getListOfDairies(user) : undefined;
    }










}