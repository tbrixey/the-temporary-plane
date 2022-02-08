import request from "supertest";
import app from "../app";

describe("Fails auth", () => {
  it("responds with unauthorized", async () => {
    const response = await request(app).get("/api/class");

    expect(response.status).toEqual(401);
  });
});
