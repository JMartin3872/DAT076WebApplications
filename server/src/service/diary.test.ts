import { Diary, Entry } from "../model/diary"
import { DiaryService } from "./diary"

let diaryService : DiaryService;
let diary : Diary;

beforeEach(() => {
    diaryService = new DiaryService();

});

test('Should delete the diary and return a list of remaining diaries', async () => {
    await diaryService.createDiary("User1", "Diary1");
    await diaryService.createDiary("User1", "Diary2");

    const diariesBefore = await diaryService.getListOfDiaries("User1"); 
    expect(diariesBefore.length).toBe(2);

    const diarydelete  = await diaryService.deleteDiary("User1", 0);
    const remainingDiaries = await diaryService.getListOfDiaries("User1");

    expect(diarydelete).toEqual(remainingDiaries);
    expect(remainingDiaries.length).toBe(1);
    expect(remainingDiaries[0].id).toBe(1);
    }
)


test('Only owner of a diary should be able to delete it', async () =>{
   await diaryService.createDiary("User1", "Diary1");
   await diaryService.createDiary("User2", "Diary1");

   const diaries = await diaryService.deleteDiary("User1", 1);
   expect(diaries).toBe("Diary not found or unauthorized.");

   const diariesOwner = await diaryService.deleteDiary("User2", 1);
   const remainingDiaries = await diaryService.getListOfDiaries("User2");
   expect(remainingDiaries.length).toBe(0);
}
);




test('Adding an entry to a diary should return an entry with the correct text', async () => {
    const diary : Diary = {
        id: 0,
        title: "TestDiary",
        owner: "TestUser",
        nextEntryId: 0,
        entries: []
    };

    

    const entry_text = "This is the entry's text";
    const entry : Entry | String = await diaryService.addEntry(diary.owner, diary.id, entry_text);
    
    //expect(typeof entry === "string");
    //expect((entry as Entry).text).toStrictEqual(entry_text);
    //expect(entry_text).toStrictEqual(entry_text)
})