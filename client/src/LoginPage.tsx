import {signIn} from "./api.ts";
import {useState} from "react";
import {Button, Container, Form, FormLabel, Row} from "react-bootstrap";
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

    if (dList !== undefined) {
        setDiaryList(dList);
        navigate("/List-of-Diaries", { state: { dList:dList, username: username} }); // Sending the diaryList state as to Tyra/Melissas page
    } else {
        console.log("Something went wrong in handleLogin(), returning undefined")
    }
}

    return (

            <Container  fluid>
                    <Row>
                    <h2  className="d-flex justify-content-center align-items-center ">Welcome to this lovely diary book</h2>
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
                                placeholder="Write your password here"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button className="mx-3 mt-4" variant="primary" type="button" onClick={handleLogin}>
                            Login!
                        </Button>

                    </Form>
                    <NavLink  className="d-flex justify-content-center align-items-center" to="/register" end style={{ display : "block"} }>Register new user!</NavLink>
                    <NavLink className="d-flex justify-content-center align-items-center" to="/changepassword" end>Change password!</NavLink>
                    </Row>
            </Container>

    )

}