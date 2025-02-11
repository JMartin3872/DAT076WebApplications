import { Diary, Entry } from "../model/diary"
import { DiaryService } from "./diary"

let diaryService : DiaryService;
let diary : Diary;

beforeEach(() => {
    diaryService = new DiaryService();
}


)

test('Adding an entry to a diary should return an entry with the correct text', async () => {
    const diary : Diary = {
        id: 0,
        title: "TestDiary",
        owner: "TestUser",
        entries: []
    };

    

    const entry_text = "This is the entry's text";
    const entry : Entry | String = await diaryService.addEntry(diary.owner, diary.id, entry_text);
    
    //expect(typeof entry === "string");
    //expect((entry as Entry).text).toStrictEqual(entry_text);
    //expect(entry_text).toStrictEqual(entry_text)
})