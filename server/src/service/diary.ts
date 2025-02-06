import {Diary} from "../model/diary";
import {Entry} from "../model/diary";

export class DiaryService {
    private diary : Diary;
    private nextEntryId : number = 0;

    constructor(diaryTitle : string) {
        let newDiary : Diary = {
            title : diaryTitle,
            entries : []
        }
        this.diary = newDiary;
    }

    async getDiaryContent() : Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }

    async addEntry (entryText : string) : Promise<Entry> {
        let newEntry : Entry = {
            id: this.nextEntryId++,
            date : Date.now(),
            text : entryText
        }
        this.diary.entries.push(newEntry);

        return newEntry;
    }

    async deleteEntry(entryId : number) : Promise<void>{
        let entryList = this.diary.entries
        let newList = entryList.filter((entry) => entry.id !== entryId)
        this.diary.entries = newList
    }
}


