import fastify from "fastify";

const server = fastify();

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
