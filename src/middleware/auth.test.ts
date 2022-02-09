import request from "supertest";
import app from "../app";
import { client, dbName } from "../mongo";

describe("Fails auth", () => {
  it("responds with unauthorized", async () => {
    const response = await request(app).get("/api/class");

    expect(response.status).toEqual(401);
  });
});

describe("Register user", () => {
  test("POST /city /race /class", async () => {
    const user = await request(app).post("/api/register/unit-test-user-new");

    const userParse = JSON.parse(user.text).data;

    const classRes = await request(app)
      .post("/api/class/Fighter")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const raceRes = await request(app)
      .post("/api/race/Human")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const cityRes = await request(app)
      .post("/api/city/Thalo")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const collection = client.db(dbName).collection("apiKeys");

    await collection.deleteOne({ playerName: "unit-test-user-new" });
    expect(classRes.status).toEqual(200);
    expect(JSON.parse(classRes.text).data.class).toBe("Fighter");
    expect(raceRes.status).toEqual(200);
    expect(JSON.parse(raceRes.text).data.race).toBe("Human");
    expect(cityRes.status).toEqual(200);
    expect(JSON.parse(cityRes.text).data.startingLocation).toBe("Thalo");
  });
});
