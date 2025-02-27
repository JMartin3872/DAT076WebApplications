
import { Diary } from "../model/diary"
import { Entry } from "../model/diary"

// Interface for a diary service
// Just consists of the already existing function signatures for now.
export interface IDiaryService {
    createDiary(username: string, diaryTitle: string): Promise<Diary | string>
    deleteDiary(username: string, diaryId: number): Promise<Diary[] | string>
    addEntry(username: string, diaryId: number, entryText: string): Promise<Entry[] | string>
    deleteEntry(username: string, diaryId: number, entryId: number): Promise<Entry[] | string>
    getListOfDiaries(username: string): Promise<Diary[]>
    getDiaryContent(): Promise<Diary>
}