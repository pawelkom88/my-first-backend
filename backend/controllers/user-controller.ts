import {Request, Response} from "express";
import {User} from "../models/user.model";

// TODO: type returned type

export class UserController {
    async register(request: Request, response: Response): Promise<any> {
        try {
            let user = await User.findOne({
                username: request.body.username,
            });

            // TODO: try guard clause !user return

            if (user) {
                return response.status(400).json({
                    error: true,
                    message: "Username is already in use",
                });
            }

            user = new User(request.body);

            await user.save();

            return response.status(201).send(user);
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                error: true,
                message: "Cannot register a user",
            });
        }
    }
}
