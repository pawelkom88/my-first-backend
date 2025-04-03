import express from "express";
import {UserController} from "./controllers/user-controller";
import {routes} from "./routes/routes";
const router = express.Router();

const controller = new UserController();

router.get(routes.root, controller.HelloWorld);

export default router