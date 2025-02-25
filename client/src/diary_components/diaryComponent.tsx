
import {useState} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import {Diary, addEntryRequest, deleteEntryRequest} from "../api.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryInputComponent } from "./diaryInputComponent.tsx";
import { EntryListComponent } from "./entryListComponent.tsx";

export function DiaryComponent() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [diary, setDiary] = useState<Diary>(location.state.diary);


    const handleAddEntry = async (newEntryText : string) => {
        console.log(newEntryText);

        try {
            const newEntryList = await addEntryRequest(diary.owner, diary.id, newEntryText);
    
            if(!newEntryList) {
                console.log("Error! Could not post new entry!");
                return;
            }
    
            const newDiary : Diary = {
                id : diary.id,
                owner : diary.owner,
                title : diary.title,
                nextEntryId : diary.nextEntryId++,
                entries : newEntryList
            };
    
            console.log(newEntryList);
            setDiary(newDiary);
        }
        catch (error) {
            console.log("Error! Something went wrong!");
        }
        
    };

    const deleteEntry = async (entryId: number) : Promise<void> =>{
        const newEntryList = await deleteEntryRequest(diary.owner, diary.id, entryId);
        
        if(!newEntryList){
            console.log("Error! Could not delete entry!");
            return;
        }
        else{
            
            const new_diary : Diary = {
                id : diary.id,
                owner : diary.owner,
                title : diary.title,
                nextEntryId : diary.nextEntryId++,
                entries : newEntryList
            }
            console.log(newEntryList);
            setDiary(new_diary);
        }
    }

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
                <Row >
                    <DiaryInputComponent onAdd={handleAddEntry}/>
                </Row>

                <Row>
                    <EntryListComponent mydiary={diary} onEntryDelete={deleteEntry}/>
                </Row>    
            </Container>
        </>
    );
}