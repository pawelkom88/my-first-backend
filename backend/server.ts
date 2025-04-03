import express, { Request, Response } from "express";
import {routes} from "./routes/routes";
import connectDB from "./db/config";
import {usersRouter} from "./routes/usersRouter";

// Create a new instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Define the root path
app.get(routes.root, (request: Request, response: Response) => {
    response.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded());

// Create the users router
app.use(`/${routes.users}`, usersRouter);

// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});