import {Diary} from "../model/diary";
import {Entry} from "../model/diary";


// Diary service class for manipulating diary and their entries
export class DiaryService {
    private diary: Diary[] = [];
    private nextDiaryId: number = 0;

    // Create a new diary if the user doesn't already have one with the same title
    async createDiary(username: string, diaryTitle: string): Promise<Diary | string> {
        if (this.diary.some(d => d.owner === username && d.title === diaryTitle)) {
            return "User already has a diary with this title.";
        }

        let newDiary: Diary = {
            id: this.nextDiaryId++,
            title: diaryTitle,
            owner: username,
            nextEntryId: 0,
            entries: []
            
        };
        this.diary.push(newDiary);
        return newDiary;
    }

    // Get all diary of a specific user
    async getListOfDiaries(username: string): Promise<Diary[]> {
        return this.diary.filter(d => d.owner === username);
    }

    // Returns a deep copy of the diary
    async getDiaryContent() : Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }

    // Delete a diary only if the requesting user is the owner
    async deleteDiary(username: string, diaryId: number): Promise<Diary[] | string> {
        const diaryIndex = this.diary.findIndex(d => d.id === diaryId && d.owner === username);
        if (diaryIndex === -1) {
            return "Diary not found or unauthorized.";
        }
        this.diary.splice(diaryIndex, 1);
        return this.getListOfDiaries(username);
    }

    // Add a new entry to the diary
    async addEntry(username: string, diaryId: number, entryText: string): Promise<Entry | string> {
        const diary = this.diary.find(d => d.id === diaryId && d.owner === username);
        if (!diary) {
            return "Diary not found or unauthorized.";
        }
        let newEntry: Entry = {
            id: diary.nextEntryId++,
            date: Date.now(),
            text: entryText
        };
        diary.entries.push(newEntry);
        return newEntry;
    }

    // Delete an entry from a diary based on id
    async deleteEntry(username: string, diaryId: number, entryId: number): Promise<Entry[] | string> {
        const diary = this.diary.find(d => d.id === diaryId && d.owner === username);
        if (!diary) {
            return "Diary not found or unauthorized.";
        }
        diary.entries = diary.entries.filter(entry => entry.id !== entryId);
        return diary.entries;
    }
}