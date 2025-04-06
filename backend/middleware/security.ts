import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model.js'
import { Types } from 'mongoose'

export type UserCredentials = {
    _id: Types.ObjectId;
    username: string;
    passwordHash: string;
    passwordSalt: string;
    refreshToken: string;
}

export interface AuthenticatedRequest extends Request {
    user?: UserCredentials
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
            message: 'No cookies provided',
        })
    }

    const { accessToken } = request.cookies
    if (!accessToken) {
        return response.status(401).json({
            error: true,
            message: 'No token',
        })
    }

    try {
        // decoding the token
        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET as string
        ) as JwtPayload

        // query DB
        const user = await User.findById(decoded._id)
            // specifies which fields to exclude from the returned result
            //  Excludes the __v field, which is used by Mongoose for versioning
            .select('-__v -password -updatedAt -createdAt')
            // converts the returned Mongoose document into a plain JavaScript object
            .lean()

        if (!user) {
            return response.status(401).json({
                error: true,
                message: 'no user',
            })
        }

        // add the user object in the req object to access it later in a route
        request.user = user

        // function that calls the next function/middleware.
        next()
    } catch (error: unknown) {
        if (error instanceof Error) {
            // 500 Internal Server Error
            return response.status(500).json({
                error: true,
                message: 'Something went wrong. Please try again later',
            })
        }
    }
}
