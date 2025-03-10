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
test('Should delete the diary and return a list of remaining diaries', async () => {
    await diaryService.createDiary("User1", "Diary1");
    await diaryService.createDiary("User1", "Diary2");

    const diariesBefore = await diaryService.getListOfDiaries("User1");
    expect(diariesBefore.length).toBe(2);

    const diarydelete = await diaryService.deleteDiary("User1", 0);
    const remainingDiaries = await diaryService.getListOfDiaries("User1");

    expect(diarydelete).toEqual(remainingDiaries);
    expect(remainingDiaries.length).toBe(1);
    expect(remainingDiaries[0].id).toBe(1);
});

// TEST #2 FOR DELETING A DIARY 
test('Only owner of a diary should be able to delete it', async () => {
    await diaryService.createDiary("User1", "Diary1");
    await diaryService.createDiary("User2", "Diary1");

    const diaries = await diaryService.deleteDiary("User1", 1);
    expect(diaries).toBe("Diary not found or unauthorized.");

    const diariesOwner = await diaryService.deleteDiary("User2", 1);
    const remainingDiaries = await diaryService.getListOfDiaries("User2");
    expect(remainingDiaries.length).toBe(0);
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
