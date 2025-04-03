import express from "express";
import {Controller} from "./controllers/controller";
import {routes} from "./routes";
const router = express.Router();

const controller = new Controller();

router.get(routes.root, controller.HelloWorld);

export default router