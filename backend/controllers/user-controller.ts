import { Request, Response } from 'express'
import { User } from '../models/user.model.js'

import { hashPassword } from './helpers/hashPassword.js'
import { comparePasswords } from './helpers/comparePasswords.js'
import {
    ACCESS_TOKEN_COOKIE_NAME,
    BASE_COOKIES_ATTR,
    generateAccessToken,
    generateRefreshToken,
    REFRESH_TOKEN_COOKIE_NAME,
    setAccessTokenCookie,
    setRefreshTokenCookie,
} from '../utils/helpers.js'
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/constants.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../middleware/security.js'

export class UserController {
    private validateEmail(email: string): boolean {
        return EMAIL_REGEX.test(email)
    }

    private validatePassword(password: string): boolean {
        return PASSWORD_REGEX.test(password)
    }
    // Private members can only be accessed from within the class where they are defined
    private async setTokensAndCookies(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any,
        response: Response
    ): Promise<void> {
        // Generate tokens
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // Store refresh token in database
        user.refreshToken = refreshToken
        await user.save()

        // Set cookies
        setAccessTokenCookie(response, accessToken)
        setRefreshTokenCookie(response, refreshToken)
    }

    register = async (
        request: Request,
        response: Response
    ): Promise<Response | undefined> => {
        const { email, password } = request.body

        if (!email || !password) {
            return response.status(400).json({
                error: true,
                message: 'email, or password is missing',
            })
        }

        if (!this.validateEmail(email)) {
            return response.status(400).json({
                error: true,
                message: 'email format is invalid',
            })
        }

        if (!this.validatePassword(password)) {
            return response.status(400).json({
                error: true,
                message: 'password strength does not meet the requirements',
            })
        }

        try {
            const existingUser = await User.findOne({
                username: email,
            })

            if (existingUser) {
                return response.status(400).json({
                    error: true,
                    message: 'Username is already in use',
                })
            }

            const hashedPassword = await hashPassword(request.body.password)

            const newUser = new User({
                username: email,
                password: hashedPassword,
            })

            await newUser.save()

            await this.setTokensAndCookies(newUser, response)

            return response.status(201).send()
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(500).json({
                    error: true,
                    message: 'Cannot register a user',
                })
            }
        }
    }

    login = async (
        request: Request,
        response: Response
    ): Promise<Response | undefined> => {
        const { email, password } = request.body

        if (!email || !password) {
            return response.status(400).json({
                error: true,
                message: 'email or password is missing',
            })
        }

        try {
            const existingUser = await User.findOne({
                username: request.body.email,
            })

            if (!existingUser) {
                return response.status(400).json({
                    error: true,
                    message: 'Username or password is incorrect',
                })
            }

            const isPasswordValid = await comparePasswords(
                request.body.password,
                existingUser.password
            )

            if (!isPasswordValid) {
                return response.status(400).json({
                    error: true,
                    message: 'Username or password is incorrect',
                })
            }

            await this.setTokensAndCookies(existingUser, response)

            return response.status(200).send({
                success: true,
                message: 'User logged in successfully',
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(500).json({
                    error: true,
                    message: 'Cannot login. Please try again later.',
                })
            }
        }
    }

    refreshToken = async (request: Request, response: Response) => {
        const { refreshToken } = request.cookies

        if (!refreshToken) {
            return response.status(401).json({
                error: true,
                message: 'Refresh token not found',
            })
        }

        try {
            // Verify the refresh token
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as JwtPayload

            // Find the user
            const user = await User.findById(decoded._id)

            if (!user || user.refreshToken !== refreshToken) {
                return response.status(403).json({
                    error: true,
                    message: 'Invalid refresh token',
                })
            }

            await this.setTokensAndCookies(user, response)

            return response.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(403).json({
                    error: true,
                    message: 'Invalid refresh token',
                })
            }
        }
    }

    logout = async (
        request: AuthenticatedRequest,
        response: Response
    ): Promise<Response | undefined> => {
        // todo : redirect on client ? any message to the user at this point ?
        // find right type for user

        // Clear the refresh token in DB
        if (request.user && request.user._id) {
            await User.findByIdAndUpdate(request.user._id, {
                refreshToken: null,
            })
        }

        // Clear cookies
        response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, BASE_COOKIES_ATTR)
        response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, BASE_COOKIES_ATTR)

        return response.status(200).json({
            success: true,
            message: 'Logged out successfully',
        })
    }
}
