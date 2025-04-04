import express from "express";
import {routes} from "./routes";
import {UserController} from "../controllers/user-controller";
import {authMiddleware} from "../controllers/helpers/authMiddleware.ts";

export const usersRouter = express.Router();

const user = new UserController();

usersRouter.post(`/${routes.register}`, user.register);
usersRouter.post(`/${routes.login}`, user.login);
usersRouter.post(`/${routes.logout}`, user.logout);

// todo: will it work ?
// usersRouter.get(`/${routes.userDetails}`, authMiddleware, (request, response) => {} );


