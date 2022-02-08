import request from "supertest";
import app from "../../app";
import { connectDB, closeDB, client, dbName } from "../../mongo";

describe("POST /register", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  it("responds with user created", async () => {
    const response = await request(app)
      .post("/api/register/unit-test-user-new")
      .set("Accept", "application/json");

    const collection = client.db(dbName).collection("apiKeys");

    await collection.deleteOne({ playerName: "unit-test-user-new" });
    expect(response.status).toEqual(201);
  });

  it("responds with user already exists", async () => {
    const response = await request(app)
      .post("/api/register/unit-test-user")
      .set("Accept", "application/json");

    expect(response.status).toEqual(409);
  });
});
