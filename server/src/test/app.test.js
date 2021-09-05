const request = require("supertest");
const server = require("../app.js");
const { closeDatabase, clearDatabase } = require("./util/databaseHandler");
const { mockRequest } = require("jest-mock-req-res");

beforeAll(async () => {
  // await connectDatabase();
  await clearDatabase();
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  await closeDatabase();
});

describe("Get the api", () => {
  test("Should get the api", async () => {
    const res = await request(server)
      .get("/api")
      .send({
        userId: 1,
        title: "test is cool"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Hello from server!");
  });
});

describe("Login", () => {
  test("Can verify valid token", async () => {
    const User = {
      first_name: "coucou",
      last_name: "c'est moi",
      email: "coucou@coucou",
      password: "coucou"
    };

    // we first register the user we want to log in as.
    const registerResponse = await request(server).post("/auth/register").send(User);
    expect(registerResponse.statusCode).toEqual(201);

    const loginResponse = await request(server).post("/auth/login").send(User);
    expect(loginResponse.statusCode).toEqual(200);
    expect(loginResponse.body).toHaveProperty("token");

    const req = mockRequest();
    req.token = loginResponse.body.token;

    const verifyTokenResponse = await request(server).post("/auth/verifyToken").send(req);
    expect(verifyTokenResponse.statusCode).toEqual(200);
    expect(verifyTokenResponse.text).toEqual("Token verified");
  });
});