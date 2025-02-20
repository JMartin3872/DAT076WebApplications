import {useState} from "react";
import {Button, Container, Form, FormLabel, Row} from "react-bootstrap";
import {registerNewUser} from "./api.ts";
import {NavLink, useNavigate} from "react-router-dom";


export function RegisterPage() {
    const [username, setUsername]  = useState<string>("");
    const [password, setPassword]  = useState<string>("");
    const navigate = useNavigate();

    const handleRegistration = async () => {
        await registerNewUser(username,password);
        navigate("/");
    }
    return (

            <Container fluid>
                <Row>
            <h2 className="d-flex justify-content-center align-items-center " >Registration page!</h2>
            <Form className="d-flex justify-content-center align-items-center mt-5">
                <Form.Group controlId="username">
                    <FormLabel>Username:</FormLabel>
                    <Form.Control
                        className="mx-2"
                        type="username"
                        placeholder="Write your username here"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <FormLabel>Password:</FormLabel>
                    <Form.Control
                        className="mx-2"
                        type="password"
                        placeholder="write your password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button className="mx-3 mt-4" variant="primary" type="button" onClick={handleRegistration}>
                    Register!
                </Button>
            </Form>
            <NavLink  className="d-flex justify-content-center align-items-center" to="/" end>Back to login screen</NavLink>
                </Row>
            </Container>


    )
}