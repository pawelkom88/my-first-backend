import express, { Response } from "express";
import {routes} from "./routes/routes";
import connectDB from "./db/config";
import {usersRouter} from "./routes/usersRouter";
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

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

// !! app.use lets us run a middleware between request and the response !!
// app level middleware

// Parse incoming requests so we have access to body
app.use(express.json());
app.use(express.urlencoded());

// Create the users router
app.use(`/${routes.auth}`, usersRouter);

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
// https://www.npmjs.com/package/express-mongo-sanitize

// It searches for KEYS, and NOT values.
app.use(mongoSanitize());

// parse cookies from request headers
app.use(cookieParser());

// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});