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
            // Check if the user already has a diary with this title
            const existing = await DiaryModel.findOne({
                where: { owner: username, title: diaryTitle }
            });
            if (existing) {
                return "You already have a diary with this title.";
            }

            // Create new diary in DB
            const created = await DiaryModel.create({
                title: diaryTitle,
                owner: username,
                nextEntryId: 0
            });

            // Return the newly created diary
            return created.toJSON() as Diary;
        } 
        catch (error) {
            console.error("There was an error creating the diary:", error);
            return "An error occurred while creating the diary.";
        }
    }

    // Delete a diary only if the requesting user is the owner
    async deleteDiary(username: string, diaryId: number): Promise<Diary[] | string> {
        try {
            // Find the diary in the DB
            const toDelete = await DiaryModel.findOne({
                where: { id: diaryId, owner: username }
            });
            if (!toDelete) {
                return "Diary not found or unauthorized.";
            }

            // Remove the diary from the DB
            await toDelete.destroy();

            // Return the updated diary list
            return this.getListOfDiaries(username);
        } 
        catch (error) {
            console.error("Error deleting diary:", error);
            return "An error occurred while deleting the diary.";
        }
    }

    async renameDiary(username: string, diaryId: number, newTitle: string): Promise<Diary[] | string> {
        try {
            // Make sure the diary belongs to this user
            const targetDiary = await DiaryModel.findOne({
                where: { id: diaryId, owner: username }
            });
            if (!targetDiary) {
                return "Diary not found or unauthorized.";
            }

            // Check if user already has a diary with this new title
            const existingTitle = await DiaryModel.findOne({
                where: { owner: username, title: newTitle }
            });
            if (existingTitle) {
                return "You already have a diary with this title.";
            }

            // Perform the rename
            targetDiary.title = newTitle;
            await targetDiary.save();

            // Return the updated list of diaries
            return this.getListOfDiaries(username);
        } 
        catch (error) {
            console.error("Error renaming diary:", error);
            return "An error occurred while renaming the diary.";
        }
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

    // Edit an entry in a diary if it exists and the user is the owner
    async editEntry(username: string, diaryId: number, entryId: number, editedText: string)
        : Promise<Entry[] | string> {
        try {
            const diary = this.diary.find(d => d.id === diaryId);

            if (!diary) {
                return "No such diary was found, unable to edit entry";
            }
            else if (diary.owner !== username) {
                return "You cannot edit an entry in a diary that you do not own";
            }
            else {
                const entry = diary.entries.find(e => e.id === entryId);
                // const entryIndex = diary.entries.findIndex(e => e.id === entryId);
                // if (entryIndex === -1) {
                //     return "No such entry was found";
                // }
                if (!entry) {
                    return "No such entry was found";
                }

                // const updatedEntries = diary.entries.map((entry, index) =>
                //     index === entryIndex ? { ...entry, text: editedText } : entry
                // );

                // diary.entries = updatedEntries;
                
                // return diary.entries;
                entry.text = editedText;
                return diary.entries;
            }
        }
        catch (error) {
            console.error("Error editing entry in diary: ", error);
            return "An error occurred while editing the entry.";
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

            const diaries = await DiaryModel.findAll({
                where: { 
                    owner: username 
                },
            });

            return diaries.map(d => d.toJSON() as Diary);
        } 
        catch (error) {
            console.error("Error fetching diaries for user:", error);
            return [];
        }
    }

    // Returns a deep copy of the diary
    async getDiaryContent(): Promise<Diary> {
        const allDiaries = await DiaryModel.findAll();
        return allDiaries as unknown as Diary;
    }
}

