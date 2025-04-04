import jwt, {JwtPayload} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import{User} from '../models/user.model';

// todo add more
export const preventCrossSiteScripting = (_: Request, response: Response, next: NextFunction): void => {
    response.setHeader('X-XSS-Protection', '1; mode=block');
    next();
}

type User = {
    username: string,
    password: string
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export const authMiddleware = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
) => {
    if (!request.cookies) {
        // 401 "unauthenticated". That is, the client must authenticate itself to get the requested response.
        // TODO: duplication in messages
        return response.status(401).json({
            error: true,
            message: 'email or password is incorrect'
        })
    }

    const {token} = request.cookies;
    if (!token) {
        return response.status(401).json({
            error: true,
            message: 'email or password is incorrect'
        })
    }

    try {
        // decoding the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // query DB
        const user = await User.findById(decoded._id)
            // specifies which fields to exclude from the returned result
            //  Excludes the __v field, which is used by Mongoose for versioning
            .select('-__v -password -updatedAt -createdAt')
            // converts the returned Mongoose document into a plain JavaScript object
            .lean();

        if (!user) {
            return response.status(401).json({
                error: true,
                message: 'email or password is incorrect'
            })
        }

        // add the user object in the req object to access it later in a route
        request.user = user;

        // function that calls the next function/middleware.
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            // 500 Internal Server Error
            return response.status(500).json({
                error: true,
                message: "Something went wrong. Please try again later",
            });
        }
    }
}

