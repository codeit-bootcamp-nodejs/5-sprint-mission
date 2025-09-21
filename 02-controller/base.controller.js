import express from 'express'

export class BaseController {
    #basePath;
    #router;

    constructor(basePath){ 
        this.#basePath = basePath;
        this.#router = express.Router();
    }

    get basePath(){ 
        return this.#basePath;
    }

    get router(){ 
        return this.#router;
    }
}