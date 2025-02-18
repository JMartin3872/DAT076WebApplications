import {useState} from "react";
import {Card, Row, Container, Button, Col} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Entry} from "../api.ts";


export function EntryComponent(prop: {myEntry : Entry}) {

    const long_text: string = "This is a long text for testing purposes. It is supposed to be very long as to test how the text will wrap around the edges of a card or other components. Maybe there is a better way to test this but this is what I could think of from the top of my head. I think this should be long enough for now at least."

    const [entry, setEntry] = useState<Entry>(prop.myEntry) // hook

    
    return(
        <>
            <div>
                <Card border="dark" style={{minWidth: '45rem'}} bg='light'>
                        <Card.Header>
                            <Row>
                                <Col className="text-start">
                                    <p className="datetext">
                                        {entry.date}
                                    </p>
                                    
                                </Col>

                                <Col className="text-end">
                                    <Button className="diarybutton" variant="outline-danger">
                                        Delete
                                    </Button>
                                </Col>
                                
                                
                            </Row>
                            

                        </Card.Header>
                        <Container >
                            <Card.Body className="text-start">
                                {entry.text + long_text}
                            </Card.Body>
                        </Container>
                </Card>
            </div>
        </>
    );
}