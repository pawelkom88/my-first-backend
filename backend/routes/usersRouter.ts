import express from "express";
import {routes} from "./routes";
import {UserController} from "../controllers/user-controller";

export const usersRouter = express.Router();

const user = new UserController();

usersRouter.post(routes.register, user.register);


