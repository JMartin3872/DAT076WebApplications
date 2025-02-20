import { useState } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import { Diary } from "./api";
import "./diaryListComponent.css";

export function DiaryListComponent() {
    const navigate = useNavigate();
    const [diaryList,setDiaryList] = useState<Diary[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [diaryTitle, setDiaryTitle] = useState("");
    const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
    const [editMode, setEditMode] = useState(false);

    const logOutButton = () => {
        navigate("/"); // Currently only navigates back to Login page. 
    };

    const handleCreateDiary = () => {
        setShowModal(true);
        setEditMode(false);
    };

    const handleSaveDiary = () => {
        if (diaryTitle.trim() !== "") {
            if (editMode && selectedDiary) {
                // RENAME DIARY
                setDiaryList(
                    diaryList.map(d => d.id === selectedDiary.id ? { ...d, title: diaryTitle } : d)
                );
            } 
            else {
                // CREATE DIARY
                const newDiary: Diary = {
                    id: diaryList.length + 1,
                    title: diaryTitle,
                    owner: "Current User",
                    nextEntryId: 0,
                    entries: [],
                };
                setDiaryList([...diaryList, newDiary]);
            }
            setDiaryTitle("");
            setShowModal(false);
            setSelectedDiary(null);
        }
    };

    const handleDeleteDiary = async(diaryId: number) => {
        setDiaryList(diaryList.filter(d => d.id !== diaryId));
    };

    const handleRenameDiary = (diary: Diary) => {
        setSelectedDiary(diary);
        setDiaryTitle(diary.title);
        setEditMode(true);
        setShowModal(true);
    };


    return (
        <>
            <div className="text-center">
                <h1>List of your Diaries</h1>
            </div>

            <Button variant="success" type="button" onClick={handleCreateDiary}>
                Create Diary
            </Button>

            <ul className="diary-list">
                {diaryList.map((diary) => (
                    <li key={diary.id}>
                        <NavLink to={`/diary/`} state={{diary: diary}} className="diary-link">
                        {diary.title}                         
                        </NavLink>
                        <Dropdown> 
                            <Dropdown.Toggle variant="link" className="dots-button">
                                ⋮
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleRenameDiary(diary)}>
                                    Rename
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDeleteDiary(diary.id)}>
                                    Delete
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => console.log("Cancelled")}>
                                    Cancel
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                ))}
            </ul>


            <Button variant="danger" type="button" onClick={logOutButton}>
                Log out
            </Button> 


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Rename Diary" : "Create New Diary"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="diaryTitle">
                        <Form.Label>Diary Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter diary title"
                            value={diaryTitle}
                            onChange={(e) => setDiaryTitle(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveDiary}>
                       {editMode ? "Rename" : "Create" }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
} 