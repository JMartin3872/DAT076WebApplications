import { Diary } from "../model/diary";
import { Entry } from "../model/diary";
import { IDiaryService } from "./diaryServiceInterface";
import { DiaryModel } from "../../db/diary.db";
import { EntryModel } from "../../db/entry.db";


// Diary service class for manipulating diary and their entries
export class DiaryService implements IDiaryService {
    private diary: Diary[] = [];

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
            });

            // Make a new diary based on the result from db and add an empty list to it.
            const newDiary = created.toJSON() as Diary;
            newDiary.entries = [];

            // Return the newly created diary
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
    async addEntry(diaryId: number, entryText: string)
        : Promise<Entry[] | string> {
        try {

            const targetDiary = await DiaryModel.findOne({
                where: { id: diaryId }
            });


            if (!targetDiary) {
                return "Could not add entry as the specified diary does not exist or you do not own it";
            }

            else {
                // Here the db functionality is tested by creating a new diary and storing it in db
                const created = await EntryModel.create({
                    // diary id is omitted here as postgres autoincrements and sets id on each diary added, see diary.db.ts
                    diaryId: diaryId,
                    text: entryText,
                    time: Date.now()

                })

                const entries = await EntryModel.findAll({
                    where: {
                        diaryId: diaryId
                    },
                });

                return entries.map(e => e.toJSON() as Entry);
            }
        }

        catch (error) {
            console.error("Error adding entry to diary:", error);
            return "An error occurred while adding the entry.";
        }
    }

    // Edit an entry in a diary if it exists and the user is the owner
    async editEntry(diaryId: number, entryId: number, editedText: string)
        : Promise<Entry[] | string> {
        try {

            const targetDiary = await DiaryModel.findOne({
                where: { id: diaryId }
            });


            if (!targetDiary) {
                return "Could not edit entry as the specified diary does not exist or you do not own it";
            }
           
            else {
                const targetEntry = await EntryModel.findOne({
                    where: { id: entryId, diaryId: diaryId }
                });
             
                if (!targetEntry) {
                    return "No such entry was found";
                }

                await targetEntry.update(
                    { text: editedText },
                    {
                        where : { id: entryId, diaryId: diaryId }
                });

                const entries = await EntryModel.findAll({
                    where: {
                        diaryId: diaryId
                    },
                });

                return entries.map(e => e.toJSON() as Entry);
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

            const target_diaries = await DiaryModel.findAll({
                where: {
                    owner: username
                },
            });


            // Turn diares into JSON
            const diaries = target_diaries.map(d => d.toJSON() as Diary);

            // Get promises for updating diaries with their corresponding entries
            const promises = diaries.map(d => this.getEntries(d));

            // Wait for promises to resolve
            const diariesWithEntries = await Promise.all(promises);
            
            // Return list of diaries with entries
            return diariesWithEntries;

        }
        catch (error) {
            console.error("Error fetching diaries for user:", error);
            return [];
        }
    }

    async getEntries(diary : Diary): Promise<Diary> {
        const updated_diary = diary;
        const target_entries = await EntryModel.findAll({
            where: {
                diaryId: diary.id
            }
        });

        if(target_entries){
            const entries = target_entries.map(e => e.toJSON() as Entry);
            updated_diary.entries = entries
            return updated_diary;
        }

        updated_diary.entries = [];
        return updated_diary;
    }

    // Returns a deep copy of the diary
    async getDiaryContent(): Promise<Diary> {
        const allDiaries = await DiaryModel.findAll();
        return allDiaries as unknown as Diary;
    }
}

