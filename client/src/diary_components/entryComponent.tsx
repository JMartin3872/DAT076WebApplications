import {useState} from "react";
import {Card, Row, Container, Button, Col} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Entry, Diary} from "../api.ts";

type EntryComponentProps = {
    myEntry: Entry;
    onDelete: (id: number) => void;
};


export function EntryComponent({ myEntry, onDelete }: EntryComponentProps) {

    const long_text: string = "This is a long text for testing purposes. It is supposed to be very long as to test how the text will wrap around the edges of a card or other components. Maybe there is a better way to test this but this is what I could think of from the top of my head. I think this should be long enough for now at least."

    const [entry, setEntry] = useState<Entry>(myEntry) // hook

    if (!myEntry) return null; // Prevents crashes if myEntry is undefined

    
    return(
        <>
            <div>
                <Card border="dark" style={{minWidth: '45rem'}} bg='light'>
                        <Card.Header>
                            <Row>
                                <Col className="text-start">
                                    
                                    {entry.date}
                                    
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
                            {entry.text + long_text}
                        </Card.Body>
                </Card>
            </div>
        </>
    );
}