import request from "supertest";
import app from "../../app";
import { client, dbName } from "../../mongo";

describe("GET /travel", () => {
  it("gets travel time for destination", async () => {
    const response = await request(app)
      .get("/api/travel/Thalo")
      .set(
        "Authorization",
        "Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9"
      );

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toMatchObject({
      data: {
        message: expect.any(String),
      },
    });
  });

  it("fails auth to get travel time", async () => {
    const response = await request(app).get("/api/travel/Thalo");

    expect(response.status).toEqual(401);
  });
});

describe("POST /travel", () => {
  it("Starts travelling somewhere and tries to travel somewhere else", async () => {
    const user = await request(app).post("/api/register/unit-test-user-new");

    const userParse = JSON.parse(user.text);

    await request(app)
      .post("/api/class/Fighter")
      .set("Authorization", "Bearer " + userParse.apiKey);

    await request(app)
      .post("/api/race/Human")
      .set("Authorization", "Bearer " + userParse.apiKey);

    await request(app)
      .post("/api/city/Thalo")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const travelResOne = await request(app)
      .post("/api/travel/Drandor")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const travelResTwo = await request(app)
      .post("/api/travel/Drandor")
      .set("Authorization", "Bearer " + userParse.apiKey);

    const collection = client.db(dbName).collection("apiKeys");

    await collection.deleteOne({ playerName: "unit-test-user-new" });

    expect(travelResOne.status).toEqual(200);
    expect(travelResTwo.status).toEqual(200);
    expect(JSON.parse(travelResTwo.text).message).toEqual(
      "Currently in transit to Drandor."
    );
  });
});
