
import {registerNewUser, signIn} from "./api.ts";
import {useState} from "react";
import {Button, Form, FormLabel} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary} from "./api.ts";
import { useNavigate } from "react-router-dom";


export function LoginComponent() {

    const navigate = useNavigate();

    const [username, setUsername]  = useState<string>("");
    const [password, setPassword]  = useState<string>("");
    const [diaryList,setDiaryList] = useState<Diary[]>([]);

    const handleRegister = async () => {
        await registerNewUser(username, password);
        setPassword("");
        setUsername("");
    }
    const handleLogin = async () => {
        const list = await signIn(username,password);
        if (typeof list !== "string") {
            setDiaryList(list);
            navigate("/route to Tyra and Melissas page",{state:{diaryList}});
        }
    }
    return (
        <>
            <h2>Welcome to this lovely diary book</h2>
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
                <Button  variant="primary" type="button" onClick={handleRegister}>
                    Register
                </Button>
                <Button variant="secondary" type="button" onClick={handleLogin}>
                    Login
                </Button>
            </Form>
        </>

    )





}

