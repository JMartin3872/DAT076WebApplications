import {useState} from "react";
import {Button, Form, FormLabel} from "react-bootstrap";
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
        <>
            <h2>Registration page!</h2>
            <Form>
                <Form.Group controlId="username">
                    <FormLabel>Username</FormLabel>
                    <Form.Control

                        type="username"
                        placeholder="Write your username here"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <FormLabel>Password</FormLabel>
                    <Form.Control
                        type="password"
                        placeholder="write your password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="button" onClick={handleRegistration}>
                    Register!
                </Button>
            </Form>
            <NavLink to="/" end>Back to login screen</NavLink>
        </>
    )
}