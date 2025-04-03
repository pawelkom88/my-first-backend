import express, { Request, Response } from "express";

// Create a new instance
const app = express();

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded());

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path
app.get("/", (request: Request, response: Response) => {
    response.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});