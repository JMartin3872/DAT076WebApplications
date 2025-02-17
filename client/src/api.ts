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
    nextEntryId: number;
    entries: Entry[];
}

// Interface representing one entry in a diary
export interface Entry {
    id: number;
    date: number;
    text: string;
}

const BASE_URL = "http://localhost:8080"
export async function registerNewUser(username:string, password:string): Promise<string | undefined> {
   try {
       const response = await axios.post<string>(`${BASE_URL}/login/register`,
           {username, password})
       return response.data;
   }
   catch (e) {
       console.log(e);
       return undefined;
   }
}

export async function signIn(username:String,password:string):Promise<Diary[] | undefined> {
    try {
        const response = await axios.post<Diary[]>(
            `${BASE_URL}/login/trylogin`, {username, password})
        return response.data;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}




