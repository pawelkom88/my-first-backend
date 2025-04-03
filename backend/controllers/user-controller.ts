import {Request, Response} from "express";
import {User} from "../models/user.model";
import {hashPassword} from "./helpers/hashPassword.ts";
import {comparePasswords} from "./helpers/comparePasswords.ts";

export class UserController {
    async register(request: Request, response: Response) {
        try {
            const existingUser = await User.findOne({
                username: request.body.username,
            });

            if (existingUser) {
                return response.status(400).json({
                    error: true,
                    message: "Username is already in use",
                });
            }

            const hashedPassword = await hashPassword(request.body.password);

            const newUser = new User({
                ...request.body,
                password: hashedPassword
            });

            await newUser.save();

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
        try {
            const existingUser = await User.findOne({
                username: request.body.username,
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
}
