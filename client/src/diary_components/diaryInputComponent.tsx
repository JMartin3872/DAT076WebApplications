import {useState} from "react";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary, Entry, addEntryRequest} from "../api.ts";
import {NavLink, useNavigate} from "react-router-dom";


export function DiaryInputComponent(prop: {diary : Diary}) {
    const [diary, setDiary] = useState<Diary>(prop.diary);

    const [entryText, setEntryText] = useState<string>("");
    const navigate = useNavigate();

    const addEntry = async () : Promise <void> => {
        await addEntryRequest(diary.owner, diary.id, entryText)

        }
        
    return(
        <>
            <h2>What's on your mind?</h2>

            <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}></textarea>

            <Button variant="primary" type="button" onClick={addEntry}>
                    Post!
                </Button>
        </>

    );
}