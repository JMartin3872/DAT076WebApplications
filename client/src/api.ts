import axios from 'axios';

export interface Login{
    username : string;
    password : string;
}

const BASE_URL = "http://localhost:8080"

export async function registerNewUser(username:string, password:string): Promise<string> {
    const response = await axios.post<string>(`${BASE_URL}/login/register`,
        {username,password})
    return response.data
}



