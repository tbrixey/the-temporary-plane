const { connectDB, closeDB } = require("./src/mongo");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});
