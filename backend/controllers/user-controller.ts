import {Request, Response} from "express";
import {User} from "../models/user.model";

import {hashPassword} from "./helpers/hashPassword.ts";
import {comparePasswords} from "./helpers/comparePasswords.ts";
import {
    generateAccessToken,
    generateRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie
} from "../utils/helpers.ts";
import {routes} from "../routes/routes.ts";
import {EMAIL_REGEX} from "../utils/constants.ts";
import jwt, {JwtPayload} from 'jsonwebtoken';

export class UserController {
    validateEmail(email: string): boolean {
        return EMAIL_REGEX.test(email)
    }

    // Private members can only be accessed from within the class where they are defined
    private async setTokensAndCookies(user: any, response: Response): Promise<void> {
        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies
        setAccessTokenCookie(response, accessToken);
        setRefreshTokenCookie(response, refreshToken);
    }

    register = async (request: Request, response: Response): Promise<Response | undefined> => {
        const {email, password} = request.body;

        if (!email || !password) {
            return response.status(400).json({
                error: true,
                message: "email, or password is missing"
            })
        }

        if (!this.validateEmail(email)) {
            return response.status(400).json({
                error: true,
                message: "email format is invalid"
            })
        }

        try {
            const existingUser = await User.findOne({
                username: email,
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

            await this.setTokensAndCookies(newUser, response);

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

    login = async (request: Request, response: Response): Promise<Response | undefined> => {
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

            await this.setTokensAndCookies(existingUser, response);

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

    refreshToken = async (request: Request, response: Response) => {
        const {refreshToken} = request.cookies;

        if (!refreshToken) {
            return response.status(401).json({
                error: true,
                message: "Refresh token not found"
            });
        }

        try {
            // todo extract to a method ? with findUser ?
            // Verify the refresh token
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as JwtPayload;

            // Find the user
            const user = await User.findById(decoded._id);

            if (!user || user.refreshToken !== refreshToken) {
                return response.status(403).json({
                    error: true,
                    message: "Invalid refresh token"
                });
            }

            await this.setTokensAndCookies(user, response);

            return response.status(200).json({
                success: true,
                message: "Tokens refreshed successfully"
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(403).json({
                    error: true,
                    message: "Invalid refresh token"
                });
            }
        }
    }

    logout = async (_: Request, response: Response): Promise<Response | undefined> => {
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
