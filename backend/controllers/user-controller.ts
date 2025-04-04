import {Request, Response} from "express";
import {User} from "../models/user.model";
import {hashPassword} from "./helpers/hashPassword.ts";
import {comparePasswords} from "./helpers/comparePasswords.ts";
import {setCookie} from "../utils/helpers.ts";
import {routes} from "../routes/routes.ts";
import {EMAIL_REGEX} from "../utils/constants.ts";

export class UserController {
    constructor() {
        this.register = this.register.bind(this);
    }

    validateEmail(email: string): boolean {
        return EMAIL_REGEX.test(email)
    }

    async register(request: Request, response: Response) {
        const {email, password} = request.body;

        if (!email || !password) {
            return response.status(400).json({
                error: true,
                message: "email, or password is missing"
            })
        }

        if(!this.validateEmail(email)){
            return response.status(400).json({
                error: true,
                message: "email format is invalid"
            })
        }

        try {
            const existingUser = await User.findOne({
                username: request.body.email,
            });

            if (existingUser) {
                return response.status(400).json({
                    error: true,
                    message: "Username is already in use",
                });
            }

            const hashedPassword = await hashPassword(request.body.password);

            const newUser = new User({
                username: email,
                password: hashedPassword
            });

            await newUser.save();

            // special field _id, which is the unique identifier for that user document in the MongoDB database
            setCookie(response, newUser._id)

            return response.status(201).send(newUser);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(500).json({
                    error: true,
                    message: "Cannot register a user",
                });
            }
        }
    }

    async login(request: Request, response: Response) {

        const {email, password} = request.body;

        if (!email || !password) {
            return response.status(400).json({
                error: true,
                message: "email or password is missing"
            })
        }

        try {
            const existingUser = await User.findOne({
                username: request.body.email,
            });

            if (!existingUser) {
                return response.status(400).json({
                    error: true,
                    message: "Username or password is incorrect",
                });
            }

            const isPasswordValid = await comparePasswords(request.body.password, existingUser.password);

            if (!isPasswordValid) {
                return response.status(400).json({
                    error: true,
                    message: "Username or password is incorrect",
                });
            }

            //  sets the cookie again to ensure that the user is authenticated for the current session, with a new JWT.
            setCookie(response, existingUser._id);

            return response.status(200).send({
                success: true,
                message: "User logged in successfully",
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(500).json({
                    error: true,
                    message: "Cannot login. Please try again later.",
                });
            }
        }
    }

    async logout(_: Request, response: Response) {
        // todo : redirect on client ? any message to the user at this point ?

        try {
            // method to remove a cookie from the response header
            response.clearCookie('token', {
                path: routes.root,
                maxAge: 0,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            }).status(200)
                .json({message: "Successfully logged out"})
                .end();
        } catch (error: unknown) {
            if (error instanceof Error) {
                // todo: check status code if correct
                return response.status(400).json({
                    error: true,
                    message: "Something went wrong when logging out...",
                });
            }
        }

    }
}
