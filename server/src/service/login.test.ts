import {LoginService} from "./login";
import {Login} from "../model/login";

let loginService: LoginService;

beforeEach( () => {
    loginService = new LoginService()
});

test('Getting the initial list of login credentials mus be a empty list!', async () => {
    expect(await loginService.getLogin()).toStrictEqual([]);});

test('Registering a new login id should return a correct login id!', async () => {
    const login: Login = await loginService.registerUser("name1", "123");
    expect(login.username).toStrictEqual("name1");
    expect(login.password).toStrictEqual("123");
});