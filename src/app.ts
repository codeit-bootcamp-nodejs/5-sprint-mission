import { DependencyInjector } from "./dependency-injector";

const { httpServer, wsServer } = DependencyInjector();
httpServer.run();
wsServer.run();
