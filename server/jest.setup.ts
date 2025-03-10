import { initDB } from "./db/conn";

beforeAll(async () => {
    await initDB();
})