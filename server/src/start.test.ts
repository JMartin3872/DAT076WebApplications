import * as SuperTest from "supertest";
import {app} from "./start"
import { Diary, Entry } from "./model/diary";

const request = SuperTest.default(app);
let cookie: string[];

const testUsername = "test"
const testPassword = "test"

beforeAll(async () => {
    const res1 = await request
        .post("/login/register")
        .send({ username: testUsername, password : testPassword})

    const res2 = await request
        .post("/login")
        .send({ username: testUsername, password : testPassword})
    cookie = res2.get("Set-Cookie") as string[];
    expect(cookie).toBeTruthy();
});


// TEST #1 FOR REGISTERING A NEW USER
test("After we register a user, we should receive a 201 response", async () => {
    const user = "User1"
    const password = "password"

    const res = await request
        .post("/login/register")
        .send({username : user, password : password})

    expect(res.status).toStrictEqual(201);

});

// TEST #1 FOR CREATING A DIARY
test("After we create a diary, it should appear in the list of the user's diaries.", async () => {
    const title = "A title"
    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const res2 = await request
        .get("/diary/userdiaries")
        .set("Cookie", cookie)
        .send();

    expect(res2.status).toStrictEqual(200);
    expect(res2.body
        .some((diary : Diary) => diary.title === title))
        .toBeTruthy();
});

// TEST #1 FOR DELETING A DIARY
test("After we delete a diary, it should not appear in the list of diaries.", async () => {
    const title = "A title"

    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);
    const newDiary : Diary = res1.body;

    
    const res2 = await request
        .delete("/diary/deletediary")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id});


    expect(res2.status).toStrictEqual(200);
    expect(res2.body
        .some((diary : Diary) => diary.title === title))
        .toBeFalsy();
});

// TEST #1 FOR EDITING A DIARY
test("After editing a diary title, it should appear in the list of diaries.", async () => {
    const title = "A title"
    const newTitle = "An edited title"

    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const newDiary = res1.body;

    const res2 = await request
        .patch("/diary/renamediary")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, newTitle: newTitle, onlyTitle : false});


    expect(res2.status).toStrictEqual(200);
    expect(res2.body
        .some((diary : Diary) => diary.title === newTitle))
        .toBeTruthy();

    expect(res2.body
        .some((diary : Diary) => diary.title === title))
        .toBeFalsy();
});

// TEST #1 FOR CREATING AN ENTRY
test("After we create an entry, it should appear in the list of that diary's entries.", async () => {
    const title = "A title"
    const entryText = "A test text"
    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const newDiary : Diary = res1.body;

    const res2 = await request
        .post("/diary/addentry")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, text : entryText});

    expect(res2.status).toStrictEqual(201);
    expect(res2.body
        .some((entry : Entry) => entry.text === entryText))
        .toBeTruthy();
});

// TEST #1 FOR DELETING AN ENTRY
test("After we delete an entry, it should'nt appear in the list of that diary's entries.", async () => {
    const title = "A title"
    const entryText = "A test text"
    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const newDiary : Diary = res1.body;

    const res2 = await request
        .post("/diary/addentry")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, text : entryText});

    expect(res2.status).toStrictEqual(201);
    expect(res2.body
        .some((entry : Entry) => entry.text === entryText))
        .toBeTruthy();

    const newEntry = res2.body.pop();

    const res3 = await request
        .delete("/diary/deleteentry")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, entryId : (newEntry as Entry).id});

    expect(res3.status).toStrictEqual(200);
    expect(res3.body
        .some((entry : Entry) => entry.id === newEntry.id && entry.text === entryText))
        .toBeFalsy();
});

// TEST #1 FOR EDITING THE TEXT OF AN ENTRY
test("After we edit the text of an entry, the entry should appear in the list of that diary's entries with the new text.", async () => {
    const title = "A title"
    const entryText = "A test text"
    const newEntryText = "An edited text"

    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const newDiary : Diary = res1.body;

    const res2 = await request
        .post("/diary/addentry")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, text : entryText});

    expect(res2.status).toStrictEqual(201);
    expect(res2.body
        .some((entry : Entry) => entry.text === entryText))
        .toBeTruthy();

    const newEntry = res2.body.pop();

    const res3 = await request
        .patch("/diary/editentry")
        .set("Cookie", cookie)
        .send({
            username : testUsername, 
            diaryId : newDiary.id, 
            entryId : (newEntry as Entry).id, 
            editedText : newEntryText, 
            pinned : (newEntry as Entry).pinned
        });

    expect(res3.status).toStrictEqual(200);
    expect(res3.body
        .some((entry : Entry) => entry.id === newEntry.id && entry.text === newEntryText))
        .toBeTruthy();

    expect(res3.body
        .some((entry : Entry) => entry.id === newEntry.id && entry.text === entryText))
        .toBeFalsy();
});

// TEST #1 FOR EDITING THE PINNED STATUS OF AN ENTRY
test("After we edit the pinned status of an entry, the entry should appear in the list of that diary's entries with pinned beingn set to true.", async () => {
    const title = "A title"
    const entryText = "A test text"

    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : testUsername, title : title});

    expect(res1.status).toStrictEqual(201);

    const newDiary : Diary = res1.body;

    const res2 = await request
        .post("/diary/addentry")
        .set("Cookie", cookie)
        .send({username : testUsername, diaryId : newDiary.id, text : entryText});

    expect(res2.status).toStrictEqual(201);
    expect(res2.body
        .some((entry : Entry) => entry.text === entryText && entry.pinned === false))
        .toBeTruthy();

    const newEntry = res2.body.pop();

    const res3 = await request
        .patch("/diary/editentry")
        .set("Cookie", cookie)
        .send({
            username : testUsername, 
            diaryId : newDiary.id, 
            entryId : (newEntry as Entry).id, 
            editedText : entryText, 
            pinned : true
        });

    expect(res3.status).toStrictEqual(200);
    expect(res3.body
        .some((entry : Entry) => entry.id === newEntry.id && entry.pinned === true))
        .toBeTruthy();

    expect(res3.body
        .some((entry : Entry) => entry.id === newEntry.id && entry.pinned === false))
        .toBeFalsy();
});