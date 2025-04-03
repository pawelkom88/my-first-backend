import { Request, Response } from "express";

export class Controller {
    HelloWorld(request: Request, response: Response) {
        return response.send("Hello World");
    }
}
