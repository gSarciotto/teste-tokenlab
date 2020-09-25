import fastify from "fastify";
import { config } from "dotenv";
import { addRouteSharedSchemas } from "./addRouteSharedSchemas";
import { createNewUserRoute, CreateUserDatabase } from "./CreateUser";
import { createLoginRoute, LoginDatabase } from "./Login";
import { Bcrypt, Database, Uuid, Jwt } from "./utils";

config();

const server = fastify();
addRouteSharedSchemas(server);

const secret = process.env.JWT_SECRET;
if (!secret) {
    console.log("No JWT secret defined.");
    process.exit(1);
}
const uuid = new Uuid();
const bcrypt = new Bcrypt();
const jwt = new Jwt(secret);
const database = new Database(process.env.DB_CONNECTION);
const createUserDatabase = new CreateUserDatabase(database, uuid);
const loginDatabase = new LoginDatabase(database);

server.route(createNewUserRoute(createUserDatabase, bcrypt));
server.route(createLoginRoute(loginDatabase, bcrypt, jwt));

server.get("/", async function (request, reply) {
    await reply.send("hello world");
});

server.listen(3000, function (err, address) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`server listening on ${address}`);
});
