import { useState, useEffect } from "react";
import { Card, Row, Button, Col, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./diary.css"
import { Entry } from "../api.ts";

type EntryComponentProps = {
    myEntry: Entry;
    onEdit: (id: number, editedText: string, pinned: boolean) => void;
    onDelete: (id: number) => void;
    onTogglePin: (entry:Entry) => void;
};

// Component for displaying a single diary entry.
// Child component of EntryListComponent.
export function EntryComponent({ myEntry, onEdit, onDelete, onTogglePin }: EntryComponentProps) {

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>(myEntry.text);

    if (!myEntry) return null;

    useEffect(() => {
        setEditedText(myEntry.text);
    }, [myEntry.text]);

    const handleEditClick = () => {
        setShowEdit(true);
    }

    // Handle the enter key press to save the edited entry.
    const pressEnterEdit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && editedText.trim()) {
            e.preventDefault();
            handleSaveEdit();
        }
    }

    // Save the edited entry.
    const handleSaveEdit = () => {
        onEdit(myEntry.id, editedText, myEntry.pinned);
        setShowEdit(false);
    }

    // If the entry is pinned, return a pinned version of the entry
    if(myEntry.pinned){
        return (
            <>
                <div className="mt-3">
                    <Card border="dark" style={{ minWidth: '45rem' }} bg='light'>
                        <Card.Header>
                            <Row>
                                <Col className="text-start datetext" xs={7}>
    
                                    {new Date(Number(myEntry.time)).toLocaleString('sv-SE',{
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
    
                                </Col>
                                
                                <Col className="text-end tight-col" >
                                    <Button className="diarybutton"
                                        size ="sm"
                                        variant="secondary"
                                        onClick={() => onTogglePin(myEntry)}>
                                        Unpin
                                    </Button>
                                </Col>
    
                                <Col className="text-end tight-col" >
                                    <Button className="diarybutton"
                                        size ="sm"
                                        variant="outline-warning"
                                        onClick={handleEditClick}>
                                        Edit
                                    </Button>
                                </Col>
    
                                <Col className="text-end tight-col">
                                    <Button className="diarybutton"
                                        variant="outline-danger"
                                        size ="sm"
                                        onClick={() => onDelete(myEntry.id)}>
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
    
    
                        <Card.Body className="text-start">
                            {myEntry.text}
                        </Card.Body>
                    </Card>
    
                </div>
    
                <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="editEntryText">
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    onKeyDown={pressEnterEdit}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEdit(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveEdit}>
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    // If the entry isn't pinned, return and unpinned version of it.
    return (
        <>
            <div className="mt-3">
                <Card border="dark" style={{ minWidth: '45rem' }} bg='light'>
                    <Card.Header>
                        <Row>
                            <Col className="text-start datetext" xs={8}>

                                {new Date(Number(myEntry.time)).toLocaleString('sv-SE',{
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}

                            </Col>
                            
                            <Col className="text-end">
                                <Button className="diarybutton tight-col"
                                    size ="sm"
                                    variant="outline-secondary"
                                    onClick={() => onTogglePin(myEntry)}>
                                    Pin
                                </Button>
                            </Col>

                            <Col className="text-end mx-0" >
                                <Button className="diarybutton tight-col"
                                    size ="sm"
                                    variant="outline-warning"
                                    onClick={handleEditClick}>
                                    Edit
                                </Button>
                            </Col>

                            <Col className="text-end mx-0">
                                <Button className="diarybutton tight-col"
                                    variant="outline-danger"
                                    size ="sm"
                                    onClick={() => onDelete(myEntry.id)}>
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>


                    <Card.Body className="text-start">
                        {myEntry.text}
                    </Card.Body>
                </Card>

            </div>

            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editEntryText">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                onKeyDown={pressEnterEdit}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}