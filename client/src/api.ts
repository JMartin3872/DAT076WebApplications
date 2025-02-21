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

export async function signIn(username: string, password: string): Promise<Diary[] | undefined> {
    try {
        //Commented out the return so moch gets returned!
        await axios.post<Diary[]>(
            `${BASE_URL}/login`,{ username, password });
           // return response.data;


        // Created mock diaries to be able to see the List of Diaries page (Tyra & Melissa) without having to log in.
        const mockDiaries: Diary[] = [
            {
                id: 1,
                title: "My First Diary",
                owner: "testUser",
                nextEntryId: 1,
                entries: [
                    { id: 1, date: 1618315200, text: "Today was a good day!" },
                    { id: 2, date: 1618401600, text: "I went for a walk." }
                ]
            },
            {
                id: 2,
                title: "Second Diary",
                owner: "testUser",
                nextEntryId: 1,
                entries: [
                    { id: 1, date: 1618498000, text: "Had a great meal!" }
                ]
            }
        ];
        // Simulate a backend API call
        return mockDiaries;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export async function changePassword(username:string, oldPassword:string, newPassword:string)
    : Promise<string | undefined> {
    try {
        const response = await axios.patch<string>(
            `${BASE_URL}/login/changepassword`, {username, oldPassword,newPassword})
        return response.data;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}

export async function addEntryRequest(username: string, diaryId: number, text: string)
    : Promise<Entry[] | undefined> {
        
    try {
        const response = await axios.post<Entry[]>(`${BASE_URL}/diary/createentry`,
            {username, diaryId, text}
        );
        return response.data;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}

export async function deleteEntryRequest(username:string, diaryId:number, entryId:number)
    : Promise<Entry[] | undefined> {
    try {
        const response = await axios.delete<Entry[]>(`${BASE_URL}/diary/deleteentry`, {data:{username : username, diaryId : diaryId, entryId : entryId}});
        return response.data;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}


export async function createDiary(username: string, title: string): Promise<Diary | string> {
    try {
      const response = await axios.post<Diary | string>(`${BASE_URL}/diary/creatediary`, {
        username,
        title,
      });
      return response.data;
    } catch (e: any) {
      console.error(e);
      return "Request failed"; 
    }
  }