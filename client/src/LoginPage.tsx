import {deleteUser, signIn} from "./api.ts";
import {useState} from "react";
import {Button, Col, Container, Form, FormLabel, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
// import {Diary} from "./api.ts"; // Martin har avkommenterat detta då importen inte används om state diarylist inte anväds vilket testerna klagar på
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";



export function LoginPage() {

    const [username, setUsername]  = useState<string>("");
    const [password, setPassword]  = useState<string>("");
    //const [diaryList,setDiaryList] = useState<Diary[]>([]); // Martin har avkommenterat detta då variabeln diaryList inte användes och testerna klagade på det!
    const navigate = useNavigate();

    const handleLogin = async () => {
        const dList = await signIn(username,password);

        if (dList !== undefined) {
            navigate("/List-of-Diaries", { state: { dList:dList, username: username} }); // Sending the diaryList state as to Tyra/Melissas page
        } else {
            console.log("Something went wrong in handleLogin(), returning undefined")
        }
    }
    const handleDelete = async () => {
        const dList = await deleteUser(username,password);

        if (dList !== undefined) {
            console.log("deleted!")
        } else {
            console.log("Something went wrong in handleLogin(), returning undefined")
        }
        setUsername("")
        setPassword("")
    }

    return (
        <><Container fluid>
            <Row>
                <h2 className="d-flex justify-content-center align-items-center ">Welcome to this lovely diary book</h2>
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
                            placeholder="Write your password here"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
            <Container>
            <Row  >
                <Col className="text-center" >
                <Button className="mx-3 mt-4" variant="primary" type="button" onClick={handleLogin}>
                    Login!
                </Button>
                <Button className="mx-3 mt-4" variant="primary" type="button" onClick={handleDelete}>
                    Delete User!
                </Button>
                </Col>
            </Row>
        </Container>
            <NavLink className="d-flex justify-content-center align-items-center mt-4" to="/register" end
                     style={{display: "block"}}>Register new user!</NavLink>
            <NavLink className="d-flex justify-content-center align-items-center" to="/changepassword" end>Change
                password!</NavLink>
        </>

    )

}