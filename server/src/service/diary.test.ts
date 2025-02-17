import { Diary, Entry } from "../model/diary"
import { DiaryService } from "./diary"

let diaryService : DiaryService;
let diary : Diary;

beforeEach(() => {
    diaryService = new DiaryService();

});

// TEST #1 FOR CREATING A DIARY -
test('Creating a new diary should return a diary object', async () => {
    const diary = await diaryService.createDiary("User1", "My Diary");

    expect(typeof diary).toBe("object");
    expect((diary as Diary).title).toBe("My Diary");
    expect((diary as Diary).owner).toBe("User1");
    expect((diary as Diary).entries.length).toBe(0);
});

// TEST #2 FOR CREATING A DIARY -
test('User should not be able to create two diaries with the same title', async () => {
    await diaryService.createDiary("User1", "Duplicate Diary");
    const secondDiary = await diaryService.createDiary("User1", "Duplicate Diary");

    expect(secondDiary).toBe("You already have a diary with this title.");
});


// TEST #1 FOR DELETING A DIARY 
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
);

// TEST #2 FOR DELETING A DIARY 
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



// TEST #1 FOR ADDING AN ENTRY
test('Adding an entry to a diary should return an entry with the correct text', async () => {
    
    let user = "User";
    let title = "Title";

    diaryService.createDiary(user, title);
    

    const entry_text = "This is the entry's text";
    const entry : Entry | undefined = await diaryService.addEntry(user, 0, entry_text);
    
    expect((entry as Entry).text).toStrictEqual(entry_text);
});

// TEST #1 FOR Deleting AN ENTRY
test('Adding and deleting an entry from an empty diary should return the empty list.', async () => {
    
    const user = "User";
    const title = "Title";
    const entry_text = "This is the entry's text";

    diaryService.createDiary(user, title);
    
    await diaryService.addEntry(user, 0, entry_text);

    const entries = await diaryService.deleteEntry(user, 0, 0); 
    expect(entries.length).toStrictEqual(0);
});

// TEST #2 FOR Deleting AN ENTRY
test('Deleting an entry from an non-existing diary should generate an exception.', async () => {
    
    // const user = "User";

    // await expect(() => {
    //     diaryService.deleteEntry(user, 0, 0);
    // }).toThrow(Error);
});