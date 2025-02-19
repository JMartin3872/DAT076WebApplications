import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import { Diary } from "./api";
import "./diaryListComponent.css";

export function DiaryListComponent() {
    const navigate = useNavigate();
    const [diaryList,setDiaryList] = useState<Diary[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [diaryTitle, setDiaryTitle] = useState("");

    const logOutButton = () => {
        navigate("/"); // Currently only navigates back to Login page. 
    };

    const handleCreateDiary = () => {
        setShowModal(true);
    };

    const handleSaveDiary = () => {
        if (diaryTitle.trim() !== "") {
            const newDiary: Diary = {
                id: diaryList.length + 1,
                title: diaryTitle,
                owner: "Current User", // Currently not user specific, will be soon
                nextEntryId: 0,
                entries: []
            };

            setDiaryList([...diaryList, newDiary]);
            setDiaryTitle("");
            setShowModal(false);
        }
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
                        <NavLink to={`/diary/${diary.id}`} className="diary-link">
                            {diary.title}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <Button variant="primary" type="button" onClick={logOutButton}>
                Log out
            </Button> 

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Diary</Modal.Title>
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
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
