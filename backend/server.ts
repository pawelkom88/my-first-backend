import express from "express"

// Initiate express
const server = express()

// Define root route
server.get("/", (request: express.Request, response: express.Response) => {
    request.send("hello world");
});

// Start server
server.listen(5000);