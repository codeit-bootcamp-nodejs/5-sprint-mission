import { Injector } from "./injector";


const { httpServer, wsServer } = new Injector();

httpServer.start();
wsServer.start();
