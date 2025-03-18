
import { Diary } from "../model/diary"
import { Entry } from "../model/diary"

// Interface for a diary service
// Just consists of the already existing function signatures for now.
export interface IDiaryService {
    createDiary(username: string, diaryTitle: string): Promise<Diary | string>
    deleteDiary(username: string, diaryId: number): Promise<Diary[] | string>
    addEntry(diaryId: number, entryText: string): Promise<Entry[] | string>
    editEntry(diaryId: number, entryId: number, editedText: string, pinned: boolean): Promise<Entry[] | string>
    deleteEntry(username: string, diaryId: number, entryId: number): Promise<Entry[] | string>
    getListOfDiaries(username: string): Promise<Diary[]>
    getDiaryContent(): Promise<Diary>
    renameDiary(username: string, diaryId: number, newTitle: string, onlyTitle: boolean): Promise<Diary[] | string>
    deleteAllUserDiariesAndEntries(username : string):Promise<void>
}