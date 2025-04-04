import express, {Response, RequestHandler} from 'express';
import {routes} from "./routes";
import {UserController} from "../controllers/user-controller";
import type {AuthenticatedRequest} from "../middleware/security.ts";
import { authMiddleware} from "../middleware/security.ts";
export const usersRouter = express.Router();

const user = new UserController();

usersRouter.post(`/${routes.register}`, user.register as RequestHandler);
usersRouter.post(`/${routes.login}`, user.login as RequestHandler);
usersRouter.post(`/${routes.logout}`, authMiddleware, user.logout);
usersRouter.get(`/${routes.userDetails}`, authMiddleware, (request: AuthenticatedRequest, response: Response) => {
    if (!request.user) {
        return response.status(401).json({
            error: true,
            message: "???"
        });
    }
    response.status(200).json({ user: request.user });
});


