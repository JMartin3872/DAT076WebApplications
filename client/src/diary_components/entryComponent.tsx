import {useState} from "react";
import {Card, Row, Button, Col} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Entry} from "../api.ts";

type EntryComponentProps = {
    myEntry: Entry;
    onDelete: (id: number) => void;
};


export function EntryComponent({ myEntry, onDelete }: EntryComponentProps) {

    const [entry] = useState<Entry>(myEntry)

    if (!myEntry) return null;
    
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
                                {entry.text}
                            </Card.Body>
                    </Card>
           
            </div>
        </>
    );
}