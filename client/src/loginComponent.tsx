
import {registerNewUser} from "./api.ts";
import {useState} from "react";
import {Button, Form, FormLabel} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


export function LoginComponent() {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

   const handleRegister = async () => {
       await registerNewUser(username, password);
       setPassword("");
       setUsername("");
   }
   //TODO FIX handleLogin


    return (
        <>
            <h2>Welcome to this lovely diary book</h2>
            <Form>
                <Form.Group controlId="username">
                    <FormLabel>Email address</FormLabel>
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
                <Button  variant="primary" type="button" onClick={handleRegister}>
                    Register
                </Button>
            </Form>
        </>

    )





}

