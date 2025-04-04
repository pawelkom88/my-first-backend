import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {User} from "../../models/user.model.ts";

//todo : change name
export async function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (!request.cookies) {
        // todo : why 401 code
        response.status(401);
        throw new Error('email or password is incorrect');
    }

    const { token } = request.cookies;
    if (!token) {
        response.status(401);
        throw new Error('email or password is incorrect');
    }

    try {
        // decoding the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // query DB
        const user = await User.findById(decoded._id)
            //
            .select('-__v -password -updatedAt -createdAt')
            //
            .lean();

        if (!user) {
            response.status(401);
            throw new Error('email or password is incorrect');
        }

        // add the user object in the req object to access it later in a route
        request.user = user;

        // function that calls the next function/middleware.
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            // todo: status code ?
            return response.status(500).json({
                error: true,
                message: "??",
            });
        }
    }
}