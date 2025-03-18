import * as SuperTest from "supertest";
import {app} from "./start"
import { Diary } from "./model/diary";

const request = SuperTest.default(app);
let cookie: string[];

beforeAll(async () => {
    const res1 = await request
        .post("/login/register")
        .send({ username: "test", password: "test" })

    const res2 = await request
        .post("/login")
        .send({ username: "test", password: "test" })
    cookie = res2.get("Set-Cookie") as string[];
    expect(cookie).toBeTruthy();
});


test("After we create a diary, it should appear in the list of the user's diaries.", async () => {
    const title = "A title"
    const res1 = await request
        .post("/diary/creatediary")
        .set("Cookie", cookie)
        .send({username : "test", title : title});

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