import express, { Request, Response } from "express";
import { IDiaryService } from "../service/diaryServiceInterface";
import { DiaryService } from "../service/diary";
import { Entry } from "../model/diary";
import { Diary } from "../model/diary";

export const diaryService: IDiaryService = new DiaryService();
export const diaryRouter = express.Router();

interface AddEntryRequest extends Request {
    body: {
        username: string,
        diaryId: number,
        text: string
    },
    session: any
}

interface EditEntryRequest extends Request {
    body: {
        username: string,
        diaryId: number,
        entryId: number,
        editedText: string,
        pinned: boolean
    },
    session: any
}

interface DeleteEntryRequest extends Request {
    body: {
        username: string,
        diaryId: number,
        entryId: number
    },
    session: any
}

interface CreateDiaryRequest extends Request {
    body: {
        username: string,
        title: string
    },
    session: any
}

interface DeleteDiaryRequest extends Request {
    body: {
        username: string,
        diaryId: number
    },
    session: any
}

interface RenameDiaryRequest extends Request {
    body: {
        username: string,
        diaryId: number,
        newTitle: string,
        onlyTitle: boolean
    },
    session: any
}

interface getUserDiariesRequest extends Request {
    query: {
        username: string
    },
    session: any
}


// Handler of get requests
// Returns the full diary content
diaryRouter.get("/getalldiaries", async (req: Request, res: Response<Diary | string>) => {
    try {
        const diary: Diary = await diaryService.getDiaryContent();
        res.status(200).send(diary);
    }

    catch (e: any) {
        res.status(500).send(e.message)
    }
});

// Handles a post request to addentry
// Creates a new entry with the text in the body
diaryRouter.post("/addentry", async (
    req: AddEntryRequest,
    res: Response<Entry[] | string>
) => {

    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, diaryId, text } = req.body;

        if (typeof text !== "string") {
            res.status(400).send("Invalid type of text");
            return;
        }

        const newEntry = await diaryService.addEntry(diaryId, text);

        res.status(typeof newEntry === "string" ? 400 : 201).send(newEntry);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Handles a patch request to editentry
// Edits the entry in diary based on matching id
diaryRouter.patch("/editentry", async (
    req: EditEntryRequest,
    res: Response<Entry[] | string>
) => {
    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, diaryId, entryId, editedText, pinned } = req.body;

        if (typeof editedText !== "string") {
            res.status(400).send("Invalid type of text");
            return;
        }

        const updatedEntries = await diaryService.editEntry(diaryId, entryId, editedText, pinned);

        res.status(typeof updatedEntries === "string" ? 400 : 200).send(updatedEntries);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


// Handle a delete request to deleteentry
// Deletes the entry from diary based on matching id
diaryRouter.delete("/deleteentry", async (
    req: DeleteEntryRequest,
    res: Response<Entry[] | string>
) => {

    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, diaryId, entryId } = req.body;

        const remainingEntries = await diaryService.deleteEntry(username, diaryId, entryId)
        res.status(typeof remainingEntries === "string" ? 400 : 200).send(remainingEntries);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Create a new diary
diaryRouter.post("/creatediary", async (
    req: CreateDiaryRequest,
    res: Response<Diary | string>
) => {

    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, title } = req.body;
        const result = await diaryService.createDiary(username, title);
        res.status(typeof result === "string" ? 400 : 201).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Get all diaries of a specific user
diaryRouter.get("/userdiaries", async (
    req: Request,
    res: Response<Diary[] | string>
) => {
    const sessionUsername = (req.session as { username?: string }).username;

    if (!sessionUsername) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const diaries = await diaryService.getListOfDiaries(sessionUsername);
        res.status(200).send(diaries);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Delete an existing diary
diaryRouter.delete("/deletediary", async (
    req: DeleteDiaryRequest,
    res: Response<Diary[] | string>
) => {

    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, diaryId } = req.body;
        const result = await diaryService.deleteDiary(username, diaryId);
        res.status(typeof result === "string" ? 400 : 200).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// Rename an existing diary
diaryRouter.patch("/renamediary", async (
    req: RenameDiaryRequest,
    res: Response<Diary[] | string>
) => {
    // If request doesn't come from owner of diary, send 401 response.
    if (req.session.username !== req.body.username) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const { username, diaryId, newTitle, onlyTitle } = req.body;
        const result = await diaryService.renameDiary(username, diaryId, newTitle, onlyTitle);
        res.status(typeof result === "string" &&
            (result.includes("not found") ||
            result.includes("You already have")) ? 400 : 200).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});