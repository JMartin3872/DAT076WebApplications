// Polyfill for TextEncoder/TextDecoder if they are undefined
import {LoginPage} from "./LoginPage.tsx";
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios'
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

import {act, fireEvent, render, screen} from '@testing-library/react';
import {RegisterPage} from "./RegisterPage.tsx";




// Mock axios
jest.mock("axios")



// Mock useLocation
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
}));

//Test 1, checking if the login button is rendered!
describe('login component', () => {
    test('renders the login button', () => {
        render( <MemoryRouter>
            <LoginPage/>
        </MemoryRouter>)
        const button = screen.getByRole('button', {name : "Login!"});
        expect(button).toBeInTheDocument();
        }
    )
    //Test 2, Testing register page register button
    test('requests server when register button called', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { message: "Created!" },
        });
        render(<MemoryRouter>
            <RegisterPage/>
        </MemoryRouter>)
        const button = screen.getByRole('button', {name: "Register!"});

        await act(() => {
            fireEvent.click(button);
        });

        expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8080/login/register"
        ,{"password": "", "username": ""})
    })

    }
    )
