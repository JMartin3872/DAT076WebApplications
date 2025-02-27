import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Diary, createDiary, deleteDiary, renameDiary } from "./api";
import "./diaryListComponent.css";

export function DiaryListComponent() {
    
  const navigate = useNavigate();
  const location = useLocation();

  const [diaryList, setDiaryList] = useState<Diary[]>(location.state.dList || []);
  const [username] = useState<string>(location.state?.username || "");
  const [showModal, setShowModal] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Log out button!
  const logOutButton = () => {
    setDiaryList([]);
    navigate("/");
  };

  // Opens modal for creating a new diary
  const handleCreateDiary = () => {
    setShowModal(true);
    setEditMode(false);
    setDiaryTitle("");
    setSelectedDiary(null);
  };

  // Opens modal for rename diary
  function handleRenameDiary(diary: Diary) {
    setSelectedDiary(diary);
    setDiaryTitle(diary.title); // current title
    setEditMode(true);
    setShowModal(true);
  }

  const handleSaveDiary = async () => {
    if (!diaryTitle.trim()) return; // no empty titles!

    if (editMode && selectedDiary) {
      // RENAME DIARY
      const updatedDiaries = await renameDiary(username, selectedDiary.id, diaryTitle);
      if (!updatedDiaries) {
        console.error("Failed to rename diary from server!");
        return;
      }
      setDiaryList(updatedDiaries);
    } else {
      // CREATE DIARY
      const response = await createDiary(username, diaryTitle);
      if (typeof response !== "string") {
        setDiaryList([...diaryList, response]);
      } else {
        console.error(response); 
      }
    }

    setDiaryTitle("");
    setSelectedDiary(null);
    setShowModal(false);
    setEditMode(false);
  };

  const handleDeleteDiary = async (diaryId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this diary?");
    if (!confirmDelete) return;

    const updatedDiaries = await deleteDiary(username, diaryId);
    if (!updatedDiaries) {
      console.error("Failed to delete diary from server!");
      return;
    }
    setDiaryList(updatedDiaries);
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
            <NavLink
              to="/diary/"
              state={{ diary: diary, username: username }}
              className="diary-link"
            >
              {diary.title}
            </NavLink>

            <Button
              variant="warning" // yellow button
              className="mx-2"
              onClick={() => handleRenameDiary(diary)}
            >
              Rename
            </Button>
            <Button
              variant="danger" // red button
              onClick={() => handleDeleteDiary(diary.id)}
            >
              Delete
            </Button>
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
            {editMode ? "Rename" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
