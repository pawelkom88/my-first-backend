import { Types } from 'mongoose';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import {routes} from "../routes/routes.ts";

// https://www.npmjs.com/package/jsonwebtoken

//with default (HMAC SHA256)
export function setCookie(response: Response, _id: Types.ObjectId) {
    //  The first parameter is the information we want to store in the token,
    //  the second parameter is the JWT secret, and the third parameter is an options object.
    const jwtToken = jwt.sign({ _id }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });

    response.cookie('token', jwtToken, {
        path: routes.root,
        // makes the cookie inaccessible by client-side JavaScript
        httpOnly: true,
        // browser only sends the cookie with requests from the cookie's origin server
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        secure: process.env.NODE_ENV !== 'development',
    });
}