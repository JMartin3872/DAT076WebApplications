import {useState} from "react";
import {Button, Col, Container, Form, FormLabel, Row} from "react-bootstrap";
import {registerNewUser} from "./api.ts";
import {NavLink, useNavigate} from "react-router-dom";

//The states of RegisterPage
export function RegisterPage() {
    const [username, setUsername]  = useState<string>("");
    const [password, setPassword]  = useState<string>("");
    const navigate = useNavigate();

    const handleRegistration = async () => {
        await registerNewUser(username,password);
        navigate("/"); //When done registering the user, go back to login page.
    }

    // Visual elements of the Register page!
    return (

        <><Container fluid>
            <Row>
                <h2 className="d-flex justify-content-center align-items-center" tabIndex={0}>Registration page!</h2>
                <Form className="d-flex justify-content-center align-items-center mt-5">
                    <Form.Group controlId="username">
                        <FormLabel>Username:</FormLabel>
                        <Form.Control
                            className="mx-2"
                            type="username"
                            placeholder="Write your username here"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <FormLabel>Password:</FormLabel>
                        <Form.Control
                            className="mx-2"
                            type="password"
                            placeholder="write your password here"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
            <Container>
                <Row>
                    <Col className= "text-center">
                        <Button className="mx-3 mt-4" variant="primary" type="button" onClick={handleRegistration} aria-label = "Register user">
                            Register!
                        </Button>
                    </Col>
                </Row>
            </Container>
            <NavLink className="d-flex justify-content-center align-items-center mt-4" to="/" end aria-label = "Back to login page">Back to login
                screen</NavLink>
        </>


            )
            }