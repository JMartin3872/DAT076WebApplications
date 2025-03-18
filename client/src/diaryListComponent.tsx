import { useState } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Diary, createDiary, deleteDiary, renameDiary } from "./api";
import "./diaryListComponent.css";

export function DiaryListComponent() {
    
  const navigate = useNavigate();
  const location = useLocation();
  
  const [diaryList, setDiaryList] = useState<Diary[]>(location.state.dList);
  const [username] = useState<string>(location.state?.username || "");
  const [showModal, setShowModal] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sortByNewest, setSortByNewest] = useState<boolean>(true);

  const sortedDiaries = [...diaryList].sort((d1, d2) =>
    sortByNewest ? d2.id - d1.id : d1.id - d2.id
  );

  const sortByNew = () => setSortByNewest(true);
  const sortByOld = () => setSortByNewest(false);

  // Function to log out. Clears the list of diaries and navigates back to login page
  const logOutButton = () => {
    setDiaryList([]);
    navigate("/");
  };

  // Function to handle the creation of a new diary. Pops up modal for user to name the new diary.
  const handleCreateDiary = () => {
    setShowModal(true);
    setEditMode(false);
    setDiaryTitle("");
    setSelectedDiary(null);
  };

  // Function to handle renaming a diary.
  const handleRenameDiary = (diary: Diary) => {
    setSelectedDiary(diary);
    setDiaryTitle(diary.title);
    setEditMode(true);
    setShowModal(true);
  };

  /* 
  Function for either creating a new diary or renaming based on the state of editMode. 
  If editMode = true & a diary has been selected from the list, user wants to rename an existing diary.
  If not in editMode, user wants to create a new diary.
  */
  const handleSaveDiary = async () => {
    if (!diaryTitle.trim()) return;

    if (editMode && selectedDiary) { 
      
      const updatedDiaries = await renameDiary(username, selectedDiary.id, diaryTitle, false);
      
      if (!updatedDiaries) {
        console.error("Failed to rename diary from server!");
        return;
      }

      setDiaryList(updatedDiaries as Diary[]); // updated list with the new diary name
    } 
    
    else {
      const response = await createDiary(username, diaryTitle);
      
      if (typeof response !== "string") {
        setDiaryList([...diaryList, response]);
      } 
      
      else {
        console.error(response);
      }
    }

    setDiaryTitle("");
    setSelectedDiary(null);
    setShowModal(false);
    setEditMode(false);
  };

  // Function to handle the deletion of a diary. A confirm window will appear on the top of the page where the user must confirm the deletion.
  const handleDeleteDiary = async (diaryId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this diary? The diary will be permanently deleted!");
    if (!confirmDelete) return;

    const updatedDiaries = await deleteDiary(username, diaryId);
    if (!updatedDiaries) {
      console.error("Failed to delete diary from server!");
      return;
    }
    setDiaryList(updatedDiaries);
  };

  // The visual elements of the diary list such as buttons, the list itself & dropdown menu for sorting!
  return (
    <>
      <div className="text-center">
        <h1 tabIndex={0}>List of your Diaries</h1>
      </div>

      <div className="create-and-sort">
        <div className="create-button">
          <Button 
            variant="success" 
            type="button" 
            onClick={handleCreateDiary} 
            aria-label="Create a new diary"
            onKeyDown={(e) => e.key === "Enter" && handleCreateDiary()}
          >
            Create Diary
          </Button>

          <Dropdown className="sort-dropdown">
            <Dropdown.Toggle className="dropdown-toggle" aria-label="Sort diaries">
              Sort by:
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={sortByNew} aria-label="Sort by newest">
                Newest
              </Dropdown.Item>
              <Dropdown.Item onClick={sortByOld} aria-label="Sort by oldest">
                Oldest
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <ul className="diary-list">
        {sortedDiaries.map((diary) => (
          <li key={diary.id}>
            <NavLink 
              to="/diary/" 
              state={{ diary, username }} 
              className="diary-link" 
              tabIndex={0}
              aria-label={`Diary titled ${diary.title}`}
            >
              {diary.title}
            </NavLink>

            <div className="delete-rename-buttons">
              <Button 
                variant="warning" 
                onClick={() => handleRenameDiary(diary)}
                aria-label={`Rename ${diary.title}`}
                onKeyDown={(e) => e.key === "Enter" && handleRenameDiary(diary)}
              >
                Rename
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteDiary(diary.id)}
                aria-label={`Delete ${diary.title}`}
                onKeyDown={(e) => e.key === "Enter" && handleDeleteDiary(diary.id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="logout-button">
        <Button 
          variant="primary" 
          type="button" 
          onClick={logOutButton}
          aria-label="Log out"
          onKeyDown={(e) => e.key === "Enter" && logOutButton()}
        >
          Log out
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} aria-labelledby="modal-title">
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">{editMode ? "Rename Diary" : "Create New Diary"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="diaryTitle">
            <Form.Label>Diary Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter diary title"
              value={diaryTitle}
              onChange={(e) => setDiaryTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveDiary()}
              aria-required="true"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} aria-label="Cancel">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveDiary} aria-label={editMode ? "Rename diary" : "Create diary"}>
            {editMode ? "Rename" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
