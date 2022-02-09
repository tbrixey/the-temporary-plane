import request from "supertest";
import app from "../../app";
import { client, dbName } from "../../mongo";

describe("POST /register", () => {
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

describe("GET /player", () => {
  it("gets list of players", async () => {
    const response = await request(app).get("/api/players");

    expect(JSON.parse(response.text).data[0]).toMatchObject(
      expect.objectContaining({
        location: expect.any(String),
        playerName: expect.any(String),
        x: expect.any(Number),
        y: expect.any(Number),
      })
    );
  });

  it("gets own player data", async () => {
    const response = await request(app)
      .get("/api/player/unit-test-user")
      .set(
        "Authorization",
        "Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9"
      );

    expect(JSON.parse(response.text).data).toMatchObject({
      playerName: "unit-test-user",
      level: expect.any(Number),
    });
  });

  it("gets other player data", async () => {
    const response = await request(app)
      .get("/api/player/My Name")
      .set(
        "Authorization",
        "Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9"
      );

    expect(JSON.parse(response.text).data).toMatchObject({
      playerName: "My Name",
    });
  });

  it("gets gets player that doesn't exist", async () => {
    const response = await request(app)
      .get("/api/player/unit-test-user-new")
      .set(
        "Authorization",
        "Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9"
      );

    expect(JSON.parse(response.text)).toMatchObject({
      message: "Player not found",
    });
  });
});
