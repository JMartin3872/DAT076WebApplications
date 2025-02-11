import express, { Request, Response } from "express";
import { DiaryService } from "../service/diary";
import { Entry } from "../model/diary";
import { Diary } from "../model/diary";

// TODO: What do we do here? Should a new diary be created for each diary service?
// Should we have a new diaryservice for every diary or not?
const diaryService = new DiaryService();
export const diaryRouter = express.Router();

// Handler of get requests
// TODO: should the diary be passed here as an argument?
// Returns the full diary content
diaryRouter.get("/", async(req : Request, res : Response<Diary | string>) => {
    try{
        const diary : Diary = await diaryService.getDiaryContent();
        res.status(200).send(diary);
    }

    catch(e : any){
        res.status(500).send(e.message)
    }
});

// Handles a post request
// Creates a new entry with the text in the body
diaryRouter.post("/diary", async (
    req: Request<{}, {}, { username: string; diaryId: number; text: string }>,
    res: Response<Entry | string>
) => {
    try {
        const description = req.body.text;
        if (typeof(description) !== "string") {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type ${typeof(description)}`);
            return;
        }
        const { username, diaryId, text } = req.body;
        const newEntry = await diaryService.addEntry(username, diaryId, text);
        res.status(typeof newEntry === "string" ? 400 : 201).send(newEntry);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
})

// Handle a delete request
// Deletes the entry from diary based on matching id
diaryRouter.delete("/diary", async (
    req: Request<{}, {}, { username: string; diaryId: number; entryId: number }>,
    res: Response<Entry[] | string>
) => {
    try {
        const { username, diaryId, entryId } = req.body;
        const remainingEntries = await diaryService.deleteEntry(username, diaryId, entryId)
        res.status(typeof remainingEntries === "string" ? 400 : 200).send(remainingEntries);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
    
})

// Create a new diary
diaryRouter.post("/diary/create", async (
    req: Request<{}, {}, { username: string; title: string }>,
    res: Response<Diary | string>
) => {
    try {
        const { username, title } = req.body;
        const result = await diaryService.createDiary(username, title);
        res.status(typeof result === "string" ? 400 : 201).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Get all diaries of a specific user
diaryRouter.get("/diary/user", async (
    req: Request<{}, {}, {}, { username: string }>,
    res: Response<Diary[]>
) => {
    try {
        const { username } = req.query;
        const diaries = await diaryService.getListOfDiaries(username);
        res.status(200).send(diaries);
    } catch (e: any) {
        res.status(500).send([]);
    }
});

// Delete an entire diary
diaryRouter.delete("/diary/delete", async (
    req: Request<{}, {}, { username: string; diaryId: number }>,
    res: Response<Diary[] | string>
) => {
    try {
        const { username, diaryId } = req.body;
        const result = await diaryService.deleteDiary(username, diaryId);
        res.status(typeof result === "string" ? 400 : 200).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});