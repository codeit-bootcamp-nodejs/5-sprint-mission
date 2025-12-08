import { DependencyInjector } from "./dependency-injector";

const { httpServer, wsServer } = new DependencyInjector();

httpServer.run();
wsServer.start();