
import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import { Diary, addEntryRequest, editEntryRequest, deleteEntryRequest, getUserDiariesRequest } from "../api.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryInputComponent } from "./diaryInputComponent.tsx";
import { EntryListComponent } from "./entryListComponent.tsx";

// Parent component to DiaryInputComponent and EntryListComponent.
// This component displays the diary title, a text area to add new entries, and a list of existing entries.
// The user can add new entries to the diary and delete existing entries.
// The user can also navigate back to the list of diaries.
export function DiaryComponent() {

    const navigate = useNavigate();
    const location = useLocation();
    const [diary, setDiary] = useState<Diary>(location.state.diary);
    const [username] = useState<string>(location.state.username);

    // Function to handle adding a new entry to the diary.
    const addEntry = async (newEntryText: string) => {
        try {
            const newEntryList = await addEntryRequest(diary.owner, diary.id, newEntryText);

            if (!newEntryList) {
                window.alert("Could not post new entry!");
                return;
            }

            const newDiary: Diary = {
                id: diary.id,
                owner: diary.owner,
                title: diary.title,
                nextEntryId: diary.nextEntryId++,
                entries: newEntryList
            };
            setDiary(newDiary);
        }
        catch (error) {
            console.error("Failed to add entry!" + error);
            window.alert("Failed to add entry! Please try again.");
        }

    };

    const editEntry = async (entryId: number, editedText: string): Promise<void> => {
        try {
            const updatedEntryList = await editEntryRequest(diary.owner, diary.id, entryId, editedText);

            if (!updatedEntryList) {
                window.alert("Could not edit entry!");
                return;
            }

            const newDiary: Diary = {
                ...diary,
                entries: updatedEntryList
            };
            setDiary(newDiary);
            window.alert("Entry edited successfully!");
        }
        catch (error) {
            console.error("Failed to edit entry!" + error);
            window.alert("Failed to edit entry! Please try again.");
        }
    };

    const deleteEntry = async (entryId: number): Promise<void> => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
        if (!confirmDelete) return;

        const newEntryList = await deleteEntryRequest(diary.owner, diary.id, entryId);

        if (!newEntryList) {
            window.alert("Entry couldn't be deleted!");
            return;
        }
        else {

            const new_diary: Diary = {
                id: diary.id,
                owner: diary.owner,
                title: diary.title,
                nextEntryId: diary.nextEntryId++,
                entries: newEntryList
            }

            setDiary(new_diary);
            window.alert("Entry deleted!");
        }
    }

    // Function to navigate back to the list of diaries.
    const backToDiaries = async (): Promise<void> => {
        const dList = await getUserDiariesRequest(username);

        if (!dList) {
            console.log("Something bad happened");
        }
        else {
            navigate("/List-of-diaries", { state: { dList, username: username } });
        }
    }

    return (
        <>
            <Container fluid className="text-center">
                <Row>
                    <Col className="text-start">
                        <h1>{"Title: " + diary.title}</h1>
                    </Col>

                    <Col className="text-end">
                        <Button className="diarybutton" variant="primary" type="button" onClick={() => { backToDiaries() }}>
                            Back
                        </Button>
                    </Col>
                </Row>
                <Row >
                    <DiaryInputComponent onAdd={addEntry} />
                </Row>

                <Row>
                    <EntryListComponent
                        mydiary={diary}
                        onEntryEdit={editEntry}
                        onEntryDelete={deleteEntry}
                    />
                </Row>
            </Container>
        </>
    );
}