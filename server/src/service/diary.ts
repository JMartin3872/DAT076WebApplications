import {Diary} from "../model/diary";
import {Entry} from "../model/diary";

export class DiaryService {
    private diary : Diary;
    private nextEntryId : number = 0;

    constructor(diary: Diary) {
        this.diary = diary;
    }

    async getDiaryContent() : Promise<Diary> {
        return JSON.parse(JSON.stringify(this.diary));
    }

    async newEntry (entryTitle: string, entryText : string) : Promise<void> {
        const newEntry : Entry = {
            id: this.nextEntryId++,
            title : entryTitle,
            date : Date.now(),
            text : entryText
        }
        this.diary.entries.push(newEntry);
    }
}