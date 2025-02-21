import {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary} from "../api.ts";
import { EntryComponent } from "./entryComponent.tsx";

type EntryListComponentProps = {
    mydiary : Diary;
    onEntryDelete: (id: number) => void;
};

export function EntryListComponent({mydiary, onEntryDelete} : EntryListComponentProps) {

    const [diary, setDiary] = useState<Diary>(mydiary);

    useEffect(() => {
        setDiary(mydiary); // Update child state when parentValue changes
    }, [mydiary]);


    const myEntryComponents = diary.entries.map(entry => 
        <EntryComponent key={entry.id} myEntry={entry} onDelete={onEntryDelete}/>
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