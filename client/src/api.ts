import axios from 'axios';


axios.defaults.withCredentials = true;

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
    // Entry id, should they be unique by themselves or in combination with diary id?
    id: number;
    // The entry text
    text: string;
    // The time the entry was created represented as a number from Date.now()
    time: number;
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
        const response = await axios.post<Diary[]>(`${BASE_URL}/login`, { username, password });
        return response.data;

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

// Sends a request to the server to add an entry to a diary
export async function addEntryRequest(username: string, diaryId: number, text: string)
    : Promise<Entry[] | undefined> {

    try {
        const response = await axios.post<Entry[]>(`${BASE_URL}/diary/addentry`,
            {username, diaryId, text}
        );
        
        return response.data;
    }
    catch (e) {
        console.error("Failed to add entry: " + e);
        return undefined;
    }
}

// Sends a request to the server to edit an entry in a diary
export async function editEntryRequest(username: string, diaryId: number, entryId: number, editedText: string)
    : Promise<Entry[] | undefined> {

    try {
        const response = await axios.patch<Entry[]>(`${BASE_URL}/diary/editentry`,
            {username, diaryId, entryId, editedText}
        );
        return response.data;
    }
    catch (error) {
        console.error("Failed to edit entry: " + error);
        return undefined;
    }
};

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

export async function deleteDiary(username: string, diaryId: number): Promise<Diary[] | undefined> {
    try {
      const response = await axios.delete<Diary[]>(`${BASE_URL}/diary/deletediary`, {
        data: { username, diaryId },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting diary:", error);
      return undefined;
    }
  }

export async function renameDiary(username: string, diaryId: number, newTitle: string): Promise<Diary[] | undefined> {
    try {
      const response = await axios.patch<Diary[]>(`${BASE_URL}/diary/renamediary`, {
        username,
        diaryId,
        newTitle,
      });
      return response.data;
    } catch (error) {
      console.error("Error renaming diary:", error);
      return undefined;
    }
  }

export async function getUserDiariesRequest(username: string): Promise<Diary[] | undefined> {
    try {
        const response = await axios.get<Diary[]>(`${BASE_URL}/diary/userdiaries`, {params : {username}});
        console.log(response.data);
        return response.data;
    } catch (e: any) {
        console.error(e);
        return undefined;
    }
}