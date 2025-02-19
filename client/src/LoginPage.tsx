
import {signIn} from "./api.ts";
import {useState} from "react";
import {Button, Form, FormLabel} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary} from "./api.ts";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";



export function LoginPage() {

    const [username, setUsername]  = useState<string>("");
    const [password, setPassword]  = useState<string>("");
    const [diaryList,setDiaryList] = useState<Diary[]>([]);
    const navigate = useNavigate();

const handleLogin = async () => {
    const dList = await signIn(username,password);
    console.log(dList);
    if (dList !== undefined) {
        setDiaryList(dList);
        navigate("/List-of-Diaries", { state: { diaryList} }); // Sending the diaryList state as to Tyra/Melissas page
    } else {
        console.log("Something went wrong in handleLogin(), returning undefined")
    }
}

    return (
        <>
            <h2>Welcome to this lovely diary book</h2>
            <Form>
                <Form.Group controlId="username">
                    <FormLabel>Username:</FormLabel>
                    <Form.Control
                        type="username"
                        placeholder="Write your username here"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <FormLabel>Password:</FormLabel>
                    <Form.Control
                        type="password"
                        placeholder="write your password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="button" onClick={handleLogin}>
                    Login!
                </Button>
            </Form>
            <NavLink to="/register" end style={{ display : "block"}}>Register new user!</NavLink>
            <NavLink to="/changepassword" end>Change password!</NavLink>
        </>
    )

}

