const { register, login, verifyToken } = require("../controllers/auth");
const { connectDatabase, clearDatabase, closeDatabase } = require("./util/databaseHandler");
const { mockRequest, mockResponse } = require("jest-mock-req-res");

let User, req, res;

beforeAll(async () => {
  await connectDatabase();
  await clearDatabase();
});

beforeEach(async () => {
  req = mockRequest();
  res = mockResponse();

  User = {
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
    req.body = User;

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);

    //the password is encrypted so we can't know its value
    delete User.password;
    User.email = User.email.toLowerCase();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(User));
  });

  test("Can't create an account without password", async () => {
    req.body = User;
    delete req.body.password;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Password is required");
  });

  test("Can't create an account without email", async () => {
    req.body = User;
    delete req.body.email;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Email is required");
  });

  test("Can't create an account without first name", async () => {
    req.body = User;
    delete req.body.first_name;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("First name is required");
  });

  test("Can't create an account without last name", async () => {
    req.body = User;
    delete req.body.last_name;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Last name is required");
  });

  test("Can't create two users with the same mail", async () => {
    req.body = User;

    await register(req, res);
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith("User already exists. Please login");
  });
});

describe("Check method 'login'", () => {
  test("Can log in", async () => {
    req.body = User;

    await register(req, res);
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    //the password is encrypted so we can't know its value
    delete User.password;
    User.email = User.email.toLowerCase();

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(User));
  });

  test("Can't log in when user doesn't exist", async () => {
    req.body = User;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("User doesn't exist");
  });

  test("Can't log in with invalid credentials", async () => {
    req.body = User;

    await register(req, res);

    User.password = "false password";
    req.body = User;
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Invalid credentials");
  });


  test("Can't log without password", async () => {
    req.body = User;
    delete req.body.password;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Password is required");
  });

  test("Can't log without email", async () => {
    req.body = User;
    delete req.body.email;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Email is required");
  });
});

describe("Check method 'verifyToken'", () => {
  test("Can't verify token without token", async () => {
    // delete request token in case it exists
    delete req.body.token;

    verifyToken(req, res, undefined);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("A token is required for authentication");
  });

  test("Can't verify invalid token", async () => {
    req.body.token = "invalid";

    verifyToken(req, res, undefined);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Invalid token");
  });
});