import {useState} from "react";
import {Button, Form, FormLabel} from "react-bootstrap";
import {changePassword} from "./api.ts";
import {NavLink, useNavigate} from "react-router-dom";


//The states of changePasswordPage.
export function ChangePasswordPage() {
    const [username, setUsername]  = useState<string>("");
    const [oldPassword, setOldPassword]  = useState<string>("");
    const [newPassword, setNewPassword]  = useState<string>("");
    const navigate = useNavigate();

    //This function is called when the button "change password" is pressed
    const handleChangePassword = async () => {
        await changePassword(username,oldPassword,newPassword);
        navigate("/");      //After changing the password, goes back to the login page
    }

    // Visual elements of the change password page!
    return (
        <>
            <h2 tabIndex={0}>Change your account password!</h2>
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
                    <FormLabel>Old password:</FormLabel>
                    <Form.Control
                        type="password"
                        placeholder="write your password here"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <FormLabel>New password:</FormLabel>
                    <Form.Control
                        type="password"
                        placeholder="write your password here"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Group>
                <Button className="mt-4" variant="primary" type="button" onClick={handleChangePassword}>
                    Change password!
                </Button>
            </Form>
            <NavLink  to="/" end>Back to login screen</NavLink>
        </>
    )
}