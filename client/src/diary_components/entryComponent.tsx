import { useState, useEffect } from "react";
import { Card, Row, Button, Col, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Entry } from "../api.ts";

type EntryComponentProps = {
    myEntry: Entry;
    onEdit: (id: number, editedText: string) => void;
    onDelete: (id: number) => void;
};


export function EntryComponent({ myEntry, onEdit, onDelete }: EntryComponentProps) {

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

    const handleSaveEdit = () => {
        onEdit(myEntry.id, editedText);
        setShowEdit(false);
    }

    return (
        <>
            <div className="mt-3">
                <Card border="dark" style={{ minWidth: '45rem' }} bg='light'>
                    <Card.Header>
                        <Row>
                            <Col className="text-start datetext">

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
                                <Button className="diarybutton"
                                    variant="outline-warning"
                                    onClick={handleEditClick}>
                                    Edit
                                </Button>
                            </Col>

                            <Col className="text-end">
                                <Button className="diarybutton"
                                    variant="outline-danger"
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