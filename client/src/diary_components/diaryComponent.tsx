
import {useState} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import {Diary, Entry, signIn} from "../api.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryInputComponent } from "./diaryInputComponent.tsx";
import { EntryListComponent } from "./entryListComponent.tsx";

//Code for testing starts here
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

// code for testing stops here

export function DiaryComponent() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [diary, setDiary] = useState<Diary>(testDiary)   //(location.state.diary);  //TODO change back!

    const handleAddEntry = (newDiary: Diary) => {
        setDiary(newDiary);
    };

    return(
        <>
            <Container fluid className="text-center">
                <Row>
                    <Col className="text-start">
                        <h1>{"Title: " + diary.title}</h1>
                    </Col>

                    <Col className="text-end">
                        <Button className="diarybutton" variant="primary" type="button" onClick={() => navigate("/List-of-diaries")}>
                            Back</Button>
                    </Col>
                </Row>
                <Row>
                    <DiaryInputComponent diary={diary} onAdd={handleAddEntry}/>
                </Row>

                <Row>
                    <EntryListComponent diary={diary}/>
                </Row>    
            </Container>
        </>
    );
}