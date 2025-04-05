import express, {Response, RequestHandler} from 'express';
import {routes} from "./routes.js";
import {UserController} from "../controllers/user-controller.js";
import type {AuthenticatedRequest} from "../middleware/security.js";
import { authMiddleware} from "../middleware/security.js";

export const usersRouter = express.Router();

const user = new UserController();

usersRouter.post(`/${routes.register}`, user.register as RequestHandler);
usersRouter.post(`/${routes.login}`, user.login as RequestHandler);
// @ts-expect-error - hard to type
usersRouter.post(`/${routes.logout}`, authMiddleware, user.logout);
// @ts-expect-error - hard to type
usersRouter.get(`/${routes.userDetails}`, authMiddleware, (request: AuthenticatedRequest, response: Response) => {
    if (!request.user) {
        return response.status(401).json({
            error: true,
            message: "Could not retrieve user details"
        });
    }
    response.status(200).json({ user: request.user.username });
});

usersRouter.post(`/${routes.refreshToken}`, user.refreshToken as RequestHandler);

