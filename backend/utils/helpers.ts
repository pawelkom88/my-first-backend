import { Types } from 'mongoose';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import {routes} from "../routes/routes.ts";

// https://www.npmjs.com/package/jsonwebtoken

const TOKEN_EXPIRATION_TIME_15_MINUTES = 1000 * 60 * 15;
const TOKEN_EXPIRATION_TIME_7_DAYS = 1000 * 60 * 60 * 24 * 7;

export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
}

// Refresh token - longer lived (7 days)
export const generateRefreshToken = (userId: Types.ObjectId): string =>  {
    return jwt.sign(
        { _id: userId },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '7d' }
    );
}

// Set access token as cookie
export const setAccessTokenCookie = (response: Response, token: string): void =>  {
    response.cookie('token', token, {
        path: routes.root,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: TOKEN_EXPIRATION_TIME_15_MINUTES,
        secure: process.env.NODE_ENV !== 'development',
    });
}

// Set refresh token as cookie
export const setRefreshTokenCookie = (response: Response, token: string): void => {
    response.cookie('refreshToken', token, {
        path: routes.root,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: TOKEN_EXPIRATION_TIME_7_DAYS,
        secure: process.env.NODE_ENV !== 'development',
    });
}