import { useState } from "react";
import { Card, Row, Button, Col, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Entry } from "../api.ts";

type EntryComponentProps = {
    myEntry: Entry;
    onEdit: (id: number, editedText: string) => void;
    onDelete: (id: number) => void;
};


export function EntryComponent({ myEntry, onEdit, onDelete }: EntryComponentProps) {

    const [entry] = useState<Entry>(myEntry)
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>(entry.text);

    if (!myEntry) return null;

    const handleEditClick = () => {
        setShowEdit(true);
    }

    const handleSaveEdit = () => {
        onEdit(entry.id, editedText);
        setShowEdit(false);
    }

    return (
        <>
            <div className="mt-3">
                <Card border="dark" style={{ minWidth: '45rem' }} bg='light'>
                    <Card.Header>
                        <Row>
                            <Col className="text-start datetext">

                                {new Date(Number(entry.time)).toLocaleString('sv-SE',{
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
                                    onClick={() => onDelete(entry.id)}>
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>


                    <Card.Body className="text-start">
                        {entry.text}
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