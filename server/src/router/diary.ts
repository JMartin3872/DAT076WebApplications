import express, { Request, Response } from "express";
import { DiaryService } from "../service/diary";
import { Entry } from "../model/diary";
import { Diary } from "../model/diary";

// TODO: What do we do here? Should a new diary be created for each diary service?
// Should we have a new diaryservice for every diary or not?
const diaryService = new DiaryService("Test Dagbok");

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
diaryRouter.post("/", async (
    req: Request<{}, {}, { text : string }>,
    res: Response<Entry | string>
) => {
    try {
        const description = req.body.text;
        if (typeof(description) !== "string") {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type ${typeof(description)}`);
            return;
        }

        const newEntry = await diaryService.addEntry(description);
        res.status(201).send(newEntry);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
})

// Handle a delete request
// Deletes the entry from diary based on matching id
diaryRouter.delete("/", async (
    req: Request<{}, {}, { id : number }>,
    res: Response<Entry[] | string>
) => {
    try {
        const id = req.body.id;
        if (typeof(id) !== "number") {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id has type ${typeof(id)}`);
            return;
        }

        const remainingEntries = await diaryService.deleteEntry(id)
        res.status(200).send(remainingEntries);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
    
})