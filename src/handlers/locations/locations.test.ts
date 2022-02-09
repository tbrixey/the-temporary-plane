import request from "supertest";
import app from "../../app";

describe("GET /cities", () => {
  it("gets list of cities", async () => {
    const response = await request(app).get("/api/cities");

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text).data[0]).toMatchObject({
      _id: expect.any(String),
      name: expect.any(String),
      population: expect.any(Number),
      type: expect.any(String),
      x: expect.any(Number),
      y: expect.any(Number),
    });
  });
});
