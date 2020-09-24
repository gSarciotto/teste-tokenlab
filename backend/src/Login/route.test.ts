import fastify from "fastify";
import { createLoginRoute } from "./route";
import { UserCredentials } from "../sharedResources";
import { LoginDatabase } from "./database/LoginDatabase";
import { UserNotFound } from "./database/errors";
import { Jwt } from "../utils";
import { Bcrypt } from "../utils/wrappers/bcrypt";

jest.mock("./database/LoginDatabase", () => {
    return {
        LoginDatabase: jest.fn()
    };
});

const MockedLoginDatabase = LoginDatabase as jest.Mock<LoginDatabase>;

const methodAndRoute: { method: "POST"; url: string } = {
    method: "POST",
    url: "/login"
};

describe("POST /login should", () => {
    const server = fastify();
    const mockLoginDatabase = new MockedLoginDatabase();
    const bcrypt = new Bcrypt();
    const secret = "a secret";
    const jwt = new Jwt(secret);
    const existingUserCredentials: UserCredentials = {
        username: "exists",
        password: "password"
    };
    let hashedPassword: string;
    beforeAll(async () => {
        server.route(createLoginRoute(mockLoginDatabase, bcrypt, jwt));
        hashedPassword = await bcrypt.hash(existingUserCredentials.password);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await server.close();
    });
    test("return Created (201) and a jwt that expires in 6 hours containing user id if login is successful", async () => {
        const userId = "an uuid";
        const mockGetUserPasswordAndId = jest.fn((username: string) =>
            Promise.resolve({
                id: userId,
                password: hashedPassword
            })
        );
        mockLoginDatabase.getUserPasswordAndId = mockGetUserPasswordAndId;
        const response = await server.inject({
            ...methodAndRoute,
            payload: existingUserCredentials
        });
        expect(response.statusCode).toBe(201);
        const responseBody = response.json<{ token: string }>();
        const decodedResponseJwt = await jwt.verify<{
            iat: number;
            exp: number;
            userId: string;
        }>(responseBody.token);
        expect(decodedResponseJwt.userId).toMatch(userId);
        const secondsInHours = 3600;
        const lifeExpectancyInSeconds =
            decodedResponseJwt.exp - decodedResponseJwt.iat;
        expect(lifeExpectancyInSeconds).toBe(6 * secondsInHours);
    });
    test("return Not Found (404) if login is login fails because password is wrong", async () => {
        const wrongPasswordCredentials: UserCredentials = {
            username: existingUserCredentials.username,
            password: "wrong password"
        };
        const mockGetUserPasswordAndId = jest.fn((username: string) =>
            Promise.resolve({
                id: "any id",
                password: hashedPassword
            })
        );
        mockLoginDatabase.getUserPasswordAndId = mockGetUserPasswordAndId;
        const response = await server.inject({
            ...methodAndRoute,
            payload: wrongPasswordCredentials
        });
        expect(response.statusCode).toBe(404);
        const responseBody = response.json<{ message: string }>();
        expect(responseBody.message).toMatch("Invalid username or password");
    });
    test("return Not Found (404) if login fails because username is not registered", async () => {
        const wrongUsernameCredentials: UserCredentials = {
            username: "doesntExists",
            password: existingUserCredentials.password
        };
        const mockGetUserPasswordAndId = jest.fn((username: string) => {
            throw new UserNotFound();
        });
        mockLoginDatabase.getUserPasswordAndId = mockGetUserPasswordAndId;
        const response = await server.inject({
            ...methodAndRoute,
            payload: wrongUsernameCredentials
        });
        expect(response.statusCode).toBe(404);
        const responseBody = response.json<{ message: string }>();
        expect(responseBody.message).toMatch("Invalid username or password");
    });
});
