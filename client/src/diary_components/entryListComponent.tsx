import {Component, useState} from "react";
import {Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary, Entry} from "../api.ts";
import { EntryComponent } from "./entryComponent.tsx";



export function EntryListComponent(prop: {diary : Diary}) {

    const [diary, setDiary] = useState<Diary>(prop.diary);

    const myEntryComponents = diary.entries.map(entry => <p><EntryComponent myEntry={entry}/></p>);
    


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