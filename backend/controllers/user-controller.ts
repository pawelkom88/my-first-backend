import {Request, Response} from "express";
import {User} from "../models/user.model";
import {hashPassword} from "./helpers/hashPassword.ts";

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

            const hashedPassword  = await hashPassword(request.body.password);

            const newUser = new User({
                ...request.body,
                password: hashedPassword
            });

            await newUser.save();

            return response.status(201).send(newUser);
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                error: true,
                message: "Cannot register a user",
            });
        }
    }
}
