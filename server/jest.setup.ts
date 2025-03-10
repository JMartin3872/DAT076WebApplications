import { initDB, conn } from "./db/conn";

beforeAll(async () => {
  await initDB();
})

afterEach(async () => {
  await conn.sync({ force: true }); // Clears test data
});

afterAll(async () => {
  await conn.close(); // Cleanup
});