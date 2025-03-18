import { initDB, conn } from "./db/conn";

beforeAll(async () => {
  await initDB();
})

// Clear test data from database after each test.
afterEach(async () => {
  await conn.sync({ force: true }); 
});

// Close connection after all tests are done.
afterAll(async () => {
  await conn.close();
});