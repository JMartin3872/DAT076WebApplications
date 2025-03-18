
import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import { Diary, Entry, addEntry, editEntry, deleteEntry, getUserDiariesRequest, renameDiary } from "../api.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryInputComponent } from "./diaryInputComponent.tsx";
import { EntryListComponent } from "./entryListComponent.tsx";

// Parent component to DiaryInputComponent and EntryListComponent.
// This component displays the diary title, a back button and a rename button, a text area to add new entries and a list of existing entries.
// The user can add new entries to the diary, as well as edit and delete existing entries.
// The user can rename the diary here as well.
// The user can navigate back to the list of diaries.

export function DiaryComponent() {

    const navigate = useNavigate();
    const location = useLocation();
    const [diary, setDiary] = useState<Diary>(location.state.diary);
    const [username] = useState<string>(location.state.username);
    const [showRename, setShowRename] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>(diary.title);

    // Updates the diary title when changed.
    useEffect(() => {
            setNewTitle(diary.title);
        }, [diary.title]);

    // Function to handle adding a new entry to the diary.
    const addEntryEvent = async (newEntryText: string) => {
        try {
            const newEntryList = await addEntry(diary.owner, diary.id, newEntryText);

            if (!newEntryList) {
                window.alert("Could not post new entry!");
                return;
            }

            const newDiary: Diary = {
                id: diary.id,
                owner: diary.owner,
                title: diary.title,
                entries: newEntryList
            };
            setDiary(newDiary);
        }
        catch (error) {
            console.error("Failed to add entry!" + error);
            window.alert("Failed to add entry! Please try again.");
        }

    };

    // Function to handle editing an existing entry in the diary.
    const editEntryEvent = async (entryId: number, editedText: string, pinned: boolean): Promise<void> => {
        try {
            const updatedEntryList = await editEntry(diary.owner, diary.id, entryId, editedText, pinned);

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

    // Function to handle deleting an existing entry in the diary.
    const deleteEntryEvent = async (entryId: number): Promise<void> => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
        if (!confirmDelete) return;

        const newEntryList = await deleteEntry(diary.owner, diary.id, entryId);

        if (!newEntryList) {
            window.alert("Entry couldn't be deleted!");
            return;
        }
        else {

            const new_diary: Diary = {
                id: diary.id,
                owner: diary.owner,
                title: diary.title,
                entries: newEntryList
            }

            setDiary(new_diary);
            window.alert("Entry deleted!");
        }
    }

    // Function to handle pinning or unpinning an entry in the diary.
    const togglePinEntry = async(entry : Entry): Promise<void> => {
        const updatedEntryList = await editEntry(diary.owner, diary.id, entry.id, entry.text, !entry.pinned);

        if (!updatedEntryList) {
            if(entry.pinned){
                window.alert("Could not pin entry,");
            }

            else{
                window.alert("Could not unpin entry,");
            }
            return;
        }

        else {

            const new_diary: Diary = {
                id: diary.id,
                owner: diary.owner,
                title: diary.title,
                entries: updatedEntryList
            }

            setDiary(new_diary);
        }
    }

    // Function to handle the enter key press to rename the diary.
    const pressEnterRename = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && newTitle.trim()) {
            e.preventDefault();
            renameCurrentDiary();
        }
    }

    // Function to rename the current diary.
    const renameCurrentDiary = async (): Promise<void> => {
        try {
            // Call to api to rename the diary.
            const updatedTitle = await renameDiary(diary.owner, diary.id, newTitle, true);

            if (!updatedTitle) {
                window.alert("Could not change title!");
                return;
            }

            setDiary({ ...diary, title: updatedTitle as string });
        }
        catch (error) {
            console.error("Failed to change diary title!" + error);
            window.alert("Failed to change diary title, please try again.");
        }
        finally {
            setShowRename(false);
        }
    };

    // Function to navigate back to the list of diaries.
    const backToDiaries = async (): Promise<void> => {
        const dList = await getUserDiariesRequest(username);

        if (!dList) {
            console.log("Something bad happened");
        }
        else {
            const sortedDiaries = dList.sort((d1, d2) => d1.id - d2.id);
            navigate("/List-of-diaries", { state: { dList: sortedDiaries, username: username } });
        }
    }

    return (
        <>
            <Container fluid className="text-center min-width-container">
                <Row className="mt-4">
                    <Row>
                        <Col className="text-start">
                            <h1>{diary.title}</h1>
                        </Col>
                        <Col className="text-end">
                            <Button className="backbutton btn-sm" variant="primary" type="button" onClick={() => { backToDiaries() }}>
                                Back
                            </Button>
                        </Col>
                    </Row>
                    <Col className="text-start">
                        <Button className="renamebutton" size="sm" variant="info" type="button" onClick={() => setShowRename(true)}>
                            Rename diary
                        </Button>
                    </Col>
                    <Row>
                    </Row>
                </Row>
                <Row >
                    <DiaryInputComponent onAdd={addEntryEvent} />
                </Row>

                <Row>
                    <EntryListComponent
                        mydiary={diary}
                        onEntryEdit={editEntryEvent}
                        onEntryDelete={deleteEntryEvent}
                        onTogglePin={togglePinEntry}
                    />
                </Row>
            </Container>

            <Modal show={showRename} onHide={() => setShowRename(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rename diary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newTitle">
                            <Form.Label>New Title</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={pressEnterRename}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRename(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={renameCurrentDiary}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}