import { Diary } from "../model/diary";
import { Entry } from "../model/diary";
import { IDiaryService } from "./diaryServiceInterface";
import { DiaryModel } from "../../db/diary.db";


// Diary service class for manipulating diary and their entries
export class DiaryService implements IDiaryService {
    private diary: Diary[] = [];
    private nextDiaryId: number = 0;

    // Create a new diary if the user doesn't already have one with the same title
    async createDiary(username: string, diaryTitle: string): Promise<Diary | string> {
        try {
            if (this.diary.some(d => d.owner === username && d.title === diaryTitle)) {
                return "You already have a diary with this title.";
            }

            // Here the db functionality is tested by creating a new diary and storing it in db
            DiaryModel.create({
                // diary id is omitted here as postgres autoincrements and sets id on each diary added, see diary.db.ts
                title: diaryTitle,
                owner: username,
                nextEntryId: 0
            })

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

    async renameDiary(username: string, diaryId: number, newTitle: string): Promise<Diary[] | string> {
        const targetDiary = this.diary.find(d => d.id === diaryId && d.owner === username);
        if (!targetDiary) {
            return "Diary not found or unauthorized.";
        }

        if (this.diary.some(d => d.owner === username && d.title === newTitle)) {
            return "You already have a diary with this title.";
        }

        targetDiary.title = newTitle;
        return this.getListOfDiaries(username);
    }

    // Add a new entry to a diary if it exists and the user is the owner
    async addEntry(username: string, diaryId: number, entryText: string)
        : Promise<Entry[] | string> {
        try {
            const diary = this.diary.find(d => d.id === diaryId);

            if (!diary) {
                return "Could not add entry as the specified diary does not exist";
            }
            else if (diary.owner !== username) {
                return "You cannot add an entry to a diary that you do not own";
            }
            else {
                const newEntry: Entry = {
                    id: diary.nextEntryId++,
                    date: Date.now(),
                    text: entryText
                };
                diary.entries.push(newEntry);
                return diary.entries;
            }
        }

        catch (error) {
            console.error("Error adding entry to diary:", error);
            return "An error occurred while adding the entry.";
        }
    }

    // Delete an entry from a diary
    async deleteEntry(username: string, diaryId: number, entryId: number): Promise<Entry[] | string> {
        const diary = this.diary.find(d => d.id === diaryId && d.owner === username);

        if (!diary) {
            return "No such diary was found"
        }

        diary.entries = diary.entries.filter(entry => entry.id !== entryId);
        return diary.entries;

    }

    // Get all diaries of a specific user!
    async getListOfDiaries(username: string, sessionUsername?: string): Promise<Diary[]> {
        try {
            if (sessionUsername && username !== sessionUsername) {
                throw new Error("session does not match the requested user!");
            }
            return this.diary.filter(d => d.owner === username);
        } catch (error) {
            console.error("Error fetching diaries for this user:", error);
            return [];
        }
    }

    // Returns a deep copy of the diary
    async getDiaryContent(): Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }
}

