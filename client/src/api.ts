import axios from 'axios';

export interface Login{
    username : string;
    password : string;
}
// Interface representing a diary
export interface Diary {
    // Variables for diary title and a list of entries
    id: number;
    title: string;
    owner: string;
    entries: Entry[];
}

// Interface representing one entry in a diary
export interface Entry {
    id: number;
    date: number;
    text: string;
}

const BASE_URL = "http://localhost:8080"

export async function registerNewUser(username:string, password:string): Promise<string> {
    const response = await axios.post<string>(`${BASE_URL}/login/register`,
        {username,password})
    return response.data;
}

export async function signIn(username:String,password:string):Promise<string | Diary[]> {
    const response = await axios.post<string | Diary[]>(
        `${BASE_URL}/login/trylogin`,{username,password})
    return response.data;
}




