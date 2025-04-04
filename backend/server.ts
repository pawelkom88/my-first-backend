import express, { Response } from "express";
import {routes} from "./routes/routes";
import connectDB from "./db/config";
import {usersRouter} from "./routes/usersRouter";
import {mongoSanitize} from 'express-mongo-sanitize';

// Create a new instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Define the root path
app.get(routes.root, (_, response: Response) => {
    response.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
// https://www.npmjs.com/package/express-mongo-sanitize
app.use(mongoSanitize());

// Create the users router
app.use(`/${routes.auth}`, usersRouter);

// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});