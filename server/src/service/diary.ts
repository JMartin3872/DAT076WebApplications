import {Diary} from "../model/diary";
import {Entry} from "../model/diary";


// Diary service class for manipulating diary and their entries
export class DiaryService {
    private diary: Diary[] = [];
    private nextDiaryId: number = 0;

    // Create a new diary if the user doesn't already have one with the same title
    async createDiary(username: string, diaryTitle: string): Promise<Diary | string> {
        try {
            if (this.diary.some(d => d.owner === username && d.title === diaryTitle)) {
                return "You already have a diary with this title.";
            }
            let newDiary: Diary = {
                id: this.nextDiaryId++,
                title: diaryTitle,
                owner: username,
                entries: [],
                nextEntryId: 0,
            };
            this.diary.push(newDiary);
            return newDiary;
        }
       
        catch (error) {
            console.error("There was an error creating the diary:", error);
            return "An error occurred while creating the diary.";
        }
    }    

    // Delete a diary only if the requesting user is the owner
    async deleteDiary(username: string, diaryId: number): Promise<Diary[] | string> {
        try {
            const diaryIndex = this.diary.findIndex(d => d.id === diaryId && d.owner === username);
            if (diaryIndex === -1) {
                return "Diary not found or unauthorized.";
            }
            this.diary.splice(diaryIndex, 1);
            return this.getListOfDiaries(username);
        }
       
        catch (error) {
            console.error("Error deleting diary:", error);
            return "An error occurred while deleting the diary.";
        }
    }    

    // Add a new entry to the diary
    async addEntry(username: string, diaryId: number, entryText: string)
    : Promise<Entry[] | string> {
        
        const diary = this.diary.find(d => d.id === diaryId && d.owner === username);
        
        if(!diary){
                return "Could not add entry to diary as diary was not found"
            }

        const newEntry: Entry = {
            id: diary.nextEntryId++,
            date: Date.now(),
            text: entryText
        };
        diary.entries.push(newEntry);
        return diary.entries;
    }

    // Delete an entry from a diary
    async deleteEntry(username: string, diaryId: number, entryId: number): Promise<Entry[] | string> {
        const diary = this.diary.find(d => d.id === diaryId && d.owner === username);
        
            if(!diary){
                return "No such diary was found"
            }

            diary.entries = diary.entries.filter(entry => entry.id !== entryId);
            return diary.entries;
               
    }
   
    // Get all diaries of a specific user
    //TODO: I think here you ladies should control the session and see if its the correct user! :)
    async getListOfDiaries(username: string): Promise<Diary[]> {
        try {
            return this.diary.filter(d => d.owner === username);
        }
       
        catch (error) {
            console.error("Error fetching diaries for user:", error);
            return [];
        }
    }    

    // Returns a deep copy of the diary
    async getDiaryContent() : Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }
}
