import express, { Response, Express } from 'express'
import { routes } from './routes/routes.js'
import connectDB from './db/config.js'
import { usersRouter } from './routes/usersRouter.js'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'

// TODO: rateLimit

// Set the network port
const PORT = Number(process.env.PORT) || 3000
// Create a new instance
const app = express()

// https://www.npmjs.com/package/cors
app.use(
    cors({
        origin: process.env.VITE_CLIENT_API_URL,
        credentials: true, // Allows cookies to be sent with requests
    })
)
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(mongoSanitize())

app.set('trust proxy', 1)
// Define the root path
app.get(routes.root, (_, response: Response) => {
    response.json({ message: 'Welcome to the Express + TypeScript Server!' })
})
// Create the users router
app.use(`/${routes.auth}`, usersRouter)


function startServer(app: Express, port: number) {
    try {
        // Connect to the database
        connectDB()
        // Start the server
        app.listen(port, () => {
            console.log(`The server is running at http://localhost:${port}`)
        })
    } catch (e) {
        console.error(e)
    }
}

startServer(app, PORT)
