const usersController = require("./usersController");
const { User } = require("../models");

jest.mock("../models/User");

describe("Users controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((message) => message),
      json: jest.fn((data) => data),
    };

    next = jest.fn();
  });

  test("should not return the user", async () => {
    User.findOne.mockImplementation(() => null);
    const user = await usersController.login(req, res, next);
    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledWith(401);
  });

  test("should return the user", async () => {
    const data = {
      email: "test@gmail.com",
      password: "Test1",
    };
    req.body = data;

    User.findOne.mockImplementation(() => {
      const user = new User();
      user.id = "id-1";
      user.email = req.body.email;
      user.subscription = "pro";
      user.avatarURL = "";
      user.validatePassword = jest.fn(() => true);
      user.save = jest.fn();
      return user;
    });

    const response = await usersController.login(req, res, next, data);

    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledWith(200);
    expect(response).toBeDefined();
    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("email");
    expect(response.user).toHaveProperty("subscription");
    expect(typeof response.user.email).toBe("string");
    expect(typeof response.user.subscription).toBe("string");
  });
});
