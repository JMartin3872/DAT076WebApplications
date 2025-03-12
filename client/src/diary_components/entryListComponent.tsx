import {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary} from "../api.ts";
import { EntryComponent } from "./entryComponent.tsx";

type EntryListComponentProps = {
    mydiary : Diary;
    onEntryEdit: (id: number, editedText: string) => void;
    onEntryDelete: (id: number) => void;
};

export function EntryListComponent({mydiary, onEntryEdit, onEntryDelete} : EntryListComponentProps) {

    const [diary, setDiary] = useState<Diary>(mydiary);

    useEffect(() => {
        setDiary(mydiary); // Update child state when parentValue changes
    }, [mydiary]);

    // Sort entries, newest first, and then create entry components from them.
    const myEntryComponents = [...diary.entries].sort((e1, e2) => e2.id - e1.id).map(entry => 
        <EntryComponent 
            key={entry.id} 
            myEntry={entry}
            onEdit={onEntryEdit} 
            onDelete={onEntryDelete}
        />
    );

    if (!diary) return null;


    return(
        <>
            <div>
                <Row className="text-center">
                    <h2>Entries</h2>
                </Row>  
                <Row>
                    <ul>{myEntryComponents}</ul>
                </Row>      
            </div>
        </>
    );
}