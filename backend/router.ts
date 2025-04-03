import express from "express";
import {Controller} from "./controllers/controller";
const router = express.Router();

const controller = new Controller();

router.get("/", controller.HelloWorld);

export default router