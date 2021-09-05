const { register, login } = require("../controllers/auth");
const { mockRequest, mockResponse } = require("./util/interceptor");
const { connectDatabase, clearDatabase, closeDatabase } = require("./util/databaseHandler");

let testRequestBody;

beforeAll(async () => {
  await connectDatabase();
  await clearDatabase();
});

beforeEach(async () => {
  testRequestBody = {
    first_name: "coucou",
    last_name: "c'est moi",
    email: "coucou@coucou",
    password: "coucou"
  };

  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Check method 'register'", () => {
  test("Can create an account", async () => {
    const req = mockRequest();
    req.body = testRequestBody;

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    //the password is encrypted so we can't know its value
    delete testRequestBody.password;
    testRequestBody.email = testRequestBody.email.toLowerCase();

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(testRequestBody));
  });

  test("Can't create an account without password", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.password;

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Password is required");
  });

  test("Can't create an account without email", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.email;

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Email is required");
  });

  test("Can't create an account without first name", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.first_name;

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("First name is required");
  });

  test("Can't create an account without last name", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.last_name;

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Last name is required");
  });

  test("Can't create two users with the same mail", async () => {
    const req = mockRequest();
    req.body = testRequestBody;

    const res = mockResponse();

    await register(req, res);
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith("User already exists. Please login");
  });
});

describe("Check method 'login'", () => {
  test("Can log in", async () => {
    const req = mockRequest();
    req.body = testRequestBody;

    const res = mockResponse();

    await register(req, res);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    //the password is encrypted so we can't know its value
    delete testRequestBody.password;
    testRequestBody.email = testRequestBody.email.toLowerCase();

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(testRequestBody));
  });

  test("Can't log in when user doesn't exist", async () => {
    const req = mockRequest();
    req.body = testRequestBody;

    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('User doesn\'t exist');
  });

  test("Can't log in with invalid credentials", async () => {
    const req = mockRequest();
    req.body = testRequestBody;

    const res = mockResponse();

    await register(req, res);

    testRequestBody.password = 'false password';
    req.body = testRequestBody;
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid credentials');
  });


  test("Can't log without password", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.password;

    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Password is required");
  });

  test("Can't log without email", async () => {
    const req = mockRequest();
    req.body = testRequestBody;
    delete req.body.email;

    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Email is required");
  });
});
