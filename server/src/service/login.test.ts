import {LoginService} from "./login";
import {Login} from "../model/login";
import {log} from "node:util";

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

test('Changing a usernames password should return the username with the new password', async () => {
    await loginService.registerUser("name2","123");
    const login :Login | undefined = await loginService.changePassword("name2","123","456");
    if( login) {
        expect(login.username).toStrictEqual("name2")
        expect(login.password).toStrictEqual("456");
    }
})

test('Changing a usernames password, if the initial password is wrong, it should return undefined', async () => {
    await loginService.registerUser("name2","123");
    const login :Login | undefined = await loginService.changePassword("name2","789","456");
    expect(login).toStrictEqual(undefined)
})


test('Changing a usernames password, if the initial username is wrong, it should return undefined', async () => {
    await loginService.registerUser("name2","123");
    const login :Login | undefined = await loginService.changePassword("wrongName","123","456");
    expect(login).toStrictEqual(undefined)
})

