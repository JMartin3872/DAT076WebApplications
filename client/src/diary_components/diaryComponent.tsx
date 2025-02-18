
import {useState} from "react";
import {Container,Row,Col,Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import {Diary, Entry} from "../api.ts";
import { useNavigate } from "react-router-dom";
import { DiaryInputComponent } from "./diaryInputComponent.tsx";
import { EntryListComponent } from "./entryListComponent.tsx";

let entry1: Entry = {
    id: 0,
    date: 1,
    text: "Inlägg1! Det här är ett inlägg"
}
let entry2: Entry = {
    id: 1,
    date: 2,
    text: "Inlägg2! Det här är ett annat inlägg"
}
let entry3: Entry = {
    id: 2,
    date: 3,
    text: "Inlägg3! Det här är ett tredje inlägg"
}

let testDiary: Diary = {
    id: 0,
    title: "Test dagbok",
    owner: "Fredrik den II",
    entries: [entry1, entry2, entry3],
    nextEntryId: 0,
};

export function DiaryComponent() {

    const [diary, setDiary] = useState<Diary>(testDiary) // hook

    return(
        <>
            <Container fluid className="text-center">
                
                <Row>
                    <Col className="text-start">
                        <h1>{"Title: " + diary.title}</h1>
                    </Col>

                    <Col className="text-end">
                        <Button className="diarybutton" variant="primary" type="button">Back</Button>
                    </Col>
                </Row>
               
                
                   
                <Row>
                    <DiaryInputComponent diary={diary}/>
                    
                </Row>

                <Row>
                    <EntryListComponent diary={diary}/>
                </Row>    
            </Container>

            
        </>
    );
}