import { Diary, Entry } from "../model/diary"
import { DiaryService } from "./diary"

let diaryService: DiaryService;

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
test('Deleting a diary should return the remaining list of diaries.', async () => {
    const user = "User1";
    const title1 = "Diary1";
    const title2 = "Diary2";

    const createdDiary1 = await diaryService.createDiary(user, title1);
    const createdDiary2 = await diaryService.createDiary(user, title2);
    const testDiary1 = createdDiary1 as Diary;
    const testDiary2 = createdDiary2 as Diary;

    const diariesBefore = await diaryService.getListOfDiaries(user);
    expect(diariesBefore.length).toBe(2);

    const diaryToDeleteId = testDiary1.id;
    const diariesAfterDeletion = await diaryService.deleteDiary(user, diaryToDeleteId);

        if (Array.isArray(diariesAfterDeletion)) {
           expect(diariesAfterDeletion.length).toBe(1);

           const remainingDiary = diariesAfterDeletion[0];
           expect(remainingDiary.title).toBe("Diary2");  
    } else {
        throw new Error("expected diariesAfterDeletion to be an array, instead got: " + typeof diariesAfterDeletion);
    }
});

// TEST #2 FOR DELETING A DIARY
test('Trying to delete a non-existent diary should return an error message', async () => {
    const user = "User1";
    const title1 = "Diary1";
    
    const createdDiary = await diaryService.createDiary(user, title1);
    const testDiary = createdDiary as Diary;

    const nonExistentDiaryId = testDiary.id + 1000000;  // Assuming an ID thats far beyond the created diary ID
    const result = await diaryService.deleteDiary(user, nonExistentDiaryId);

    expect(result).toBe("Diary not found or unauthorized.");
});

// TEST #1 FOR RENAMING A DIARY
test('Renaming a diary should return the updated list of diaries', async () => {
    const user = "User1";
    const title1 = "Diary1";
    const newTitle = "NewDiary1";

    const createdDiary = await diaryService.createDiary(user, title1);
    const testDiary = createdDiary as Diary;

    const diariesAfterRename = await diaryService.renameDiary(user, testDiary.id, newTitle);

    if (Array.isArray(diariesAfterRename)) {
        expect(diariesAfterRename.length).toBe(1); 
        expect(diariesAfterRename[0].title).toBe(newTitle); 
    } 
    else {
        throw new Error("Expected diariesAfterRename to be an array, but got: " + typeof diariesAfterRename);
    }
});

// TEST #1 FOR RENAMING A DIARY
test('Renaming a diary to an existing title should leave an error message.', async () => {
    const user = "User1";
    const title1 = "Diary1";
    const title2 = "Diary2";
    const newTitle = "Diary2";  

    const diary1 = await diaryService.createDiary(user, title1);
    const diary2 = await diaryService.createDiary(user, title2);

    const diariesAfterRename = await diaryService.renameDiary(user, (diary1 as Diary).id, newTitle);

    expect(diariesAfterRename).toBe("You already have a diary with this title.");
});


// TEST #1 FOR ADDING AN ENTRY TO A DIARY
test('Adding an entry to a diary should return an entry list containing an entry with the correct text. The list length should be one longer.', async () => {

    let user = "User";
    let title = "Title";
    let entryText = "This is the entry's text";

    const diary = await diaryService.createDiary(user, title);
    let diaryId = (diary as Diary).id;
    const lengthBeforeAdd = (diary as Diary).entries.length;

    const updatedEntryList = await diaryService.addEntry(diaryId, entryText);

    expect((updatedEntryList as Entry[]).some(entry => entry.text === entryText)).toBe(true);
    expect((updatedEntryList as Entry[]).length).toBe(lengthBeforeAdd + 1);
});

// TEST #2 FOR ADDING AN ENTRY TO A DIARY
test('Should not be able to add an entry to a non-existing diary', async () => {
    let text = "This is the text for a non-existing diary";
    let noDiaryId = 1;

    const noEntryList = await diaryService.addEntry(noDiaryId, text);

    expect(noEntryList as string).toStrictEqual("Could not add entry. Unauthorized or non-existent diary.");
});

// TEST #1 FOR DELETING AN ENTRY
test('Adding and deleting an entry from an empty diary should return the empty list.', async () => {
    const user = "User";
    const title = "Title";
    const entry_text = "This is the entry's text";

    const createdDiary = await diaryService.createDiary(user, title);
    const testDiary = createdDiary as Diary;

    const createdEntry = await diaryService.addEntry(testDiary.id, entry_text);

    console.log(createdEntry);

    if (Array.isArray(createdEntry)) {
        const testEntry = createdEntry[0];
        const entries = await diaryService.deleteEntry(user, testDiary.id, testEntry.id);
        expect(entries.length).toStrictEqual(0);
    }

    else {
        // Fail the test if `createdEntry` isn't an array
        throw new Error("Expected createdEntry to be an array, but got: " + typeof createdEntry);
    }
});

// TEST #2 FOR DELETING AN ENTRY
test('Deleting an entry from an non-existing diary should return an error message.', async () => {
    const user = "User";
    const remainingentries = await diaryService.deleteEntry(user, 0, 0);
    expect(remainingentries as string).toStrictEqual("No such diary was found");
});