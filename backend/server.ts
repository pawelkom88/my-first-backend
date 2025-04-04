import express, { Response } from "express";
import {routes} from "./routes/routes";
import connectDB from "./db/config";
import {usersRouter} from "./routes/usersRouter";
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from "cors";

// TODO: rateLimit

// Create a new instance
const app = express();

app.set('trust proxy', 1);

// https://www.npmjs.com/package/cors
app.use(cors({
    origin: process.env.FRONTEND_URL, // e.g. 'https://yourfrontend.netlify.app'
    credentials: true, // Allows cookies to be sent with requests
}));

// Set the network port
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Help secure Express apps by setting HTTP response headers.
app.use(helmet());

// app.use(helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: false
// }));


// Define the root path
app.get(routes.root, (_, response: Response) => {
    response.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// parse cookies from request headers
app.use(cookieParser());

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

// Start the server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});