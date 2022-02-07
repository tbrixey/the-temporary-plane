import request from "supertest";
import app from "../../app";
import { connectDB, closeDB } from "../../mongo";

describe("POST /register", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  it("responds with user created", async () => {
    const response = await request(app)
      .post("/api/register/Test 1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
  });

  it("responds with user already exists", async () => {
    const response = await request(app)
      .post("/api/register/Test 1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(409);
  });
});
