import {Diary} from "../model/diary";
import {Entry} from "../model/diary";

// Diary service class for manipulating diaries and their entries
export class DiaryService {
    //TODO: Each diary service has one diary? Can be changed??
    private diary : Diary;
    private nextEntryId : number = 0;

    //Constructor creating a new diary as of now
    // TODO: Once again we are unsure about how we should do with this.
    constructor(diaryTitle : string) {
        let newDiary : Diary = {
            title : diaryTitle,
            entries : []
        }
        this.diary = newDiary;
    }

    // Returns a deep copy of the diary
    async getDiaryContent() : Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }

    // Creates and adds a new entry to the diary
    // Return the new entry
    async addEntry (entryText : string) : Promise<Entry> {
        let newEntry : Entry = {
            id: this.nextEntryId++,
            date : Date.now(),
            text : entryText
        }
        this.diary.entries.push(newEntry);

        return newEntry;
    }

    // Deletes an existing entry from diary based on id
    // Returns the new list of entries
    async deleteEntry(entryId : number) : Promise<Entry[]>{
        let entryList = this.diary.entries
        let newList = entryList.filter((entry) => entry.id !== entryId)
        this.diary.entries = newList
        return newList
    }
}


